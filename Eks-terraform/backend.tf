terraform {
  backend "s3" {
    bucket = "eagle"
    key    = "EKS/terraform.tfstate"
    region = "ap-south-1"
  }
}
