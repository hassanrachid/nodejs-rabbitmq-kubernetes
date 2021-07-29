const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const queueService = require('../services/rabbitmq.service');

// routes
router.post('/payload', payloadSchema, queuePayload);

module.exports = router;

function payloadSchema(req, res, next) {
    const schema = Joi.object({
        // ts must be Unix
        ts: Joi.date().timestamp('unix').required(),
        // sender is required and a string
        sender: Joi.string().required(),
        // message can contain any keys and is required
        message: Joi.object().keys().pattern(/./, Joi.any()).required(),
        // sent from ip is a string in IPv4 address and is required
        sentfromip: Joi.string().ip({
          version: [
            'ipv4'
          ],
          cidr: 'required'
        }),
        // priority is an optional integer field
        priority: Joi.number().optional()
    });
    validateRequest(req, next, schema);
}

function queuePayload(req, res, next) {

    var payload = {
      ts: req.body.ts,
      sender: req.body.sender,
      sentfromip: req.body['sent-from-ip'],
      priority: req.body.priority
    };

    queueService.publishToQueue('payload-queue', payload)
      .then(() => { 
        
        insertPayload(payload)
        res.json({ message: 'Message sent successfully to queue.' })
      
      })
      .catch(next);
}

function insertPayload(payload) {
  sql.query("INSERT INTO payloads SET ?", payload, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        res.status(500).send({
          message:
            err.message || "Error occurred saving Payload into database."
        });
        return;
      }
  
      res.status(200).send({
        message: "Successfully saved payload into database."
      });
  
    });
}