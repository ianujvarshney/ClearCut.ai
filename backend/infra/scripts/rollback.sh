#!/usr/bin/env sh
set -eu

NAMESPACE="${NAMESPACE:-clearcut}"
kubectl rollout undo deployment/clearcut-api -n "$NAMESPACE"
kubectl rollout undo deployment/clearcut-image-worker -n "$NAMESPACE"
kubectl rollout undo deployment/clearcut-media-worker -n "$NAMESPACE"
kubectl rollout undo deployment/ai-inference -n "$NAMESPACE"
kubectl rollout status deployment/clearcut-api -n "$NAMESPACE"
echo "Rollback requested for ClearCut AI services."
