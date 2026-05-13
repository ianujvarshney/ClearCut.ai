#!/usr/bin/env sh
set -eu

ENVIRONMENT="${1:-staging}"
NAMESPACE="${NAMESPACE:-clearcut}"

kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/configmap.yaml
kubectl apply -f infra/k8s/api-deployment.yaml
kubectl apply -f infra/k8s/workers.yaml
kubectl apply -f infra/k8s/ai-inference.yaml
kubectl apply -f infra/k8s/hpa.yaml
kubectl apply -f infra/k8s/ingress.yaml
kubectl rollout status deployment/clearcut-api -n "$NAMESPACE"
kubectl rollout status deployment/clearcut-image-worker -n "$NAMESPACE"
kubectl rollout status deployment/ai-inference -n "$NAMESPACE"
echo "ClearCut AI ${ENVIRONMENT} deployment completed."
