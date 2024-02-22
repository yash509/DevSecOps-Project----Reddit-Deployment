terraform {
  backend "s3" {
    bucket = "eagle"
    key    = "EKS/terraform.tfstate"
    region = "us-east-1"
  }
}
