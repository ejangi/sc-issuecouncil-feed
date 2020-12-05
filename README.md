# Star Citizen Issue Council Feed

> This Google Cloud Function converts the Issue Council listings into an RSS feed.

## Deploy

On initial deployment, you can use:

```bash
gcloud functions deploy scIssueCouncilFeed --runtime nodejs12 --trigger-http --region australia-southeast1 --allow-unauthenticated --set-env-vars "url="
```

After deploying the first time, you will have th public URL for the function. Run the same command again, but including the url variable.