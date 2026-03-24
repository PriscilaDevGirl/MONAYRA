# Monayra Architecture

## Purpose

Monayra is built to make hiring more equitable for women, trans women, and travestis by separating evaluation data from sensitive identity data.

## System components

### Frontend

- React application
- mobile-first design
- symbolic avatars instead of human photos
- candidate and company views

### Backend

- FastAPI REST API
- SQLModel domain entities
- JWT authentication for candidates and companies
- matching service with explicit inclusion rules
- protected endpoint for sensitive-data release

### Database

Recommended production database: PostgreSQL.

Logical areas:

- candidates
- sensitive_candidate_profiles
- companies
- job_postings
- job_applications
- audit logs
- user_accounts

## Privacy boundaries

### Visible during screening

- social name
- self-declared gender
- city and state
- career story
- skills and growth signals
- symbolic avatar settings

### Hidden until hiring is confirmed

- legal name
- email
- phone
- document identifiers
- direct contact links

## Responsible AI principles

- never score candidates by appearance
- never use protected fields for ranking
- log each recommendation event
- review bias patterns in required experience filters
- provide explainable score dimensions

## Suggested AWS deployment

- `Amazon RDS PostgreSQL` for relational data
- `Amazon S3` for audio and video uploads
- `Amazon ECS` or `App Runner` for the API
- `CloudFront` + `S3` or `Amplify` for the frontend
- `CloudWatch` for observability
- `AWS KMS` for encryption of sensitive fields
