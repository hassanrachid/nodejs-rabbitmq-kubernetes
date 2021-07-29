# Node.js Kubernetes app development using Skaffold

To run this application, you need to have installed Kind, which creates local Kubernetes clusters for you.

Create the cluster by running this following command:
```bash
kind create cluster --name example-api --image kindest/node:v1.18.4
```

Deploy RabbitMQ manifests to your cluster as well as exposing it locally
```bash
kubectl apply -f .\kubernetes\rabbitmq-rbac.yml
kubectl apply -f .\kubernetes\rabbitmq-configmap.yml
kubectl apply -f .\kubernetes\rabbitmq-secret.yml
kubectl apply -f .\kubernetes\rabbitmq-statefulset.yml
```

After deploying RabbitMQ to your cluster, you need to port forward it,
```bash
kubectl port-forward rabbitmq-0 8080:15672
```
You can then access RabbitMQ Web UI at http://localhost:8080/


Skaffold will deploy your API and expose it locally at http://localhost:8081/
```bash
.\skaffold dev --port-forward
```
