## Exadel final project CI part

Work with Google Cloud Platform:
1. Create an account in Google Cloud Platform
2. Connect the Google CLI on the localhost with GCP account, run `gcloud init`, then sign in to GCP account, choose project and region
3. Create a new project and Service account for Github actions. Get project ID and JSON key-file, add them to Github secrets
4. Add Storage Admin role for service account 
5. Install the Google Cloud CLI according to official guide https://cloud.google.com/sdk/docs/install-sdk
6. Enable API for Cloud container registry `gcloud services enable containerregistry.googleapis.com`

Work with Github actions:
1. Create pipeline for building application and pushing it to Cloud container registry. The pipeline is /.github/workflows/Build_and_Push.yml
2. After pipeline completes, we get an image in GCR
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/container%20registry.png?raw=true)


## Exadel final project CD part

Work with Google Cloud Platform:
1. Install the Kubectl `apt install kubectl`
2. Install Helm 3 for applying helm charts according to official guide https://helm.sh/docs/intro/install/
3. Enable required APIs `gcloud services enable container.googleapis.com`
4. Finally create Kubernetes cluster for deploying the project
`gcloud container clusters create rocket --num-nodes=5 --disk-size=15 --machine-type=e2-medium`
5. Create Bucket an cloud storage for backups
As a result we'll have working Kubernetes cluster with 5 nodes and the bucket for storage
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/cluster.png?raw=true)
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/bucket.png?raw=true)

Work with Github actions:
1. Create pipeline for deploying Rocket-chat application. After checkout and authentication in GCP runs deployment from manifests files of two Kubernetes pods: Mongo database and Chat application. The pipeline is /.github/workflows/DeployGCP.yml
2. Create pipeline for deploying metrics/logging/backup. It consists of Prometheus+Grafana stack for metrics, EFK stack for logging and Kastan application for backups. Each stack deploys in its own namespace. At first, add helm repos for each app, then deploy these apps with helm-charts. The pipeline is /.github/workflows/metrics_logging_backup.yml

Post-installation steps:
1. Run Kasten app with port-forwarding `kubectl --namespace backup port-forward service/gateway 8080:8000`. The Kasten dashboard will be available at http://127.0.0.1:8080/k10/#/ 
2. Add Bucket for storage backups
3. Create backup policy for Rocket-chat application
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/kasten.png?raw=true)
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/run_policy.png?raw=true)

4. Run Grafana via port-forwarding, browse some dashboards to monitor working cluster
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/grafana_cluster.png?raw=true)
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/grafana_workloads.png?raw=true)

5. Run Kibana via port-forwarding, add index pattern `logstash-*` and get some logs from cluster namespaces
![Result](https://github.com/alex-punkster/Rocket.Chat/blob/master/Rocket-Team/img/elastic.png?raw=true)
