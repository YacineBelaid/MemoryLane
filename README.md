# Planned coding challenge: Memory lane

### Problem definition

After a series of discovery calls we found out a problem that our users are facing. They are having a hard time sharing their memories with friends and family. They are using a combination of social media, messaging apps, and email to share their memories. They are looking for a solution that allows them to store and share their memories in a single place.

As a first iteration for this solution, we want to build a web application that allows users to create a memory lane and share it with friends and family. A memory lane is a collection of events that happened in a chronological order. Each event consists of a title, a description, a timestamp, and at least one image.

## Instructions

GMAIL ACCOUNT REQUIRED

- Fill up the env value with your own (or the one I shared by email)
-  Open a terminal
-  `npm i`.
- `npm run dev`.
- Open a second terminal
- `npm run serve:api`.
- Enjoy ! Ideally to test all functionalities, you should have two Gmail Accounts, open one private and one public broswing tab conenct your gmail account to each tab respectively and test the app on both accounts.

### Technologies
-React 
-Node
-typescript and javascript ES6
-React query (Hooks and QueryClient)
-Axios
-Zustand
-Sqlite
-Express
-Tailwind + Flowbite
-AWS S3 Bucket with pre-signed URL
-Google Oauth
-JWT stored in cookies (HTTP only)

## Extra
- I created a google App in order to have Google Oauth running with scopes and credentials
- I've created an S3 bucket in order to get a scalable and secure way to upload pictures. I had to create a specific IAM user using this role policy :
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject",
                "s3:PutObjectTagging"
            ],
            "Resource": [
                "arn:aws:s3:::thememorylane",
                "arn:aws:s3:::thememorylane/*"
            ]
        }
    ]
}
```
I also created a simple CORS policy for the S33 Bucket
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::thememorylane/*"
        }
    ]
}
```
Cloud Apps, Buckets, Credentials, Users and policies will be removed in 2 weeks.

### Futur improvements
During development I had to make choices in order to have a first solid iteration.
Here are a few things that I left on the backlog :
- Having the Landing page served through SSR or even SSG by placing it in a CDN such as Cloudfront. It will better SEO and performance.
- Having Multiple Stores instead of one large one. Decoupling and increasing coherence.
- Reducing the amount of Modals giving a clear user path.
- Developing features to enhance profile personnalisation such as uploading a new profile picture, changing your name, adding a personal description etc ...
- Let user visit their friends feed.
- Adding new ways to log in (email + password and 2FA, Apple Oauth, Facebook Oauth)
- Developing sharing features such as Friend tagging using the memory_participant table.
- Adding versioning for picture uploading on S3 bucket. this would allow to have multiple version of a file.
- Adding comments and reactions.
- Having multiple picture per memory.
- Adding a favicon
### Author
Yacine Belaid
For any inquiry contact me : yacine.bld.belaid@gmail.com

