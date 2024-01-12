"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const iam = require("aws-cdk-lib/aws-iam");
class FileStorageStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const fileStorageBucket = new s3.Bucket(this, "s3-bucket", {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            cors: [
                {
                    allowedMethods: [
                        s3.HttpMethods.GET,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.DELETE,
                    ],
                    allowedOrigins: props.allowedOrigins,
                    allowedHeaders: ["*"],
                },
            ],
        });
        // allow guests read access to the bucket.
        // fileStorageBucket.addToResourcePolicy(
        // 	new iam.PolicyStatement({
        // 		effect: iam.Effect.ALLOW,
        // 		actions: ['s3:GetObject'],
        // 		principals: [new iam.AnyPrincipal()],
        // 		resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`],
        // 	})
        // )
        const mangedPolicyForAmplifyUnauth = new iam.ManagedPolicy(this, "mangedPolicyForAmplifyUnauth", {
            description: "managed policy to allow usage of Storage Library for unauth",
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:ListBucket"],
                    resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}`],
                    conditions: {
                        StringLike: {
                            "s3:prefix": [
                                "public/",
                                "public/*",
                                "protected/",
                                "protected/*",
                            ],
                        },
                    },
                }),
            ],
            roles: [props.unauthenticatedRole],
        });
        const mangedPolicyForAmplifyAuth = new iam.ManagedPolicy(this, "mangedPolicyForAmplifyAuth", {
            description: "managed Policy to allow usage of storage library for auth",
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/private/\${cognito-identity.amazonaws.com:sub}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:ListBucket"],
                    resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}`],
                    conditions: {
                        StringLike: {
                            "s3:prefix": [
                                "public/",
                                "public/*",
                                "protected/",
                                "protected/*",
                                "private/${cognito-identity.amazonaws.com:sub}/",
                                "private/${cognito-identity.amazonaws.com:sub}/*",
                            ],
                        },
                    },
                }),
            ],
            roles: [props.authenticatedRole],
        });
        new aws_cdk_lib_1.CfnOutput(this, "BucketName", {
            value: fileStorageBucket.bucketName,
        });
        new aws_cdk_lib_1.CfnOutput(this, "BucketRegion", {
            value: this.region,
        });
    }
}
exports.FileStorageStack = FileStorageStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVN0b3JhZ2VTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVTdG9yYWdlU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTBFO0FBRTFFLHlDQUF5QztBQUN6QywyQ0FBMkM7QUFRM0MsTUFBYSxnQkFBaUIsU0FBUSxtQkFBSztJQUN6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDekQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLElBQUksRUFBRTtnQkFDSjtvQkFDRSxjQUFjLEVBQUU7d0JBQ2QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHO3dCQUNsQixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUk7d0JBQ25CLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRzt3QkFDbEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNO3FCQUN0QjtvQkFDRCxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7b0JBQ3BDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQztpQkFDdEI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILDBDQUEwQztRQUMxQyx5Q0FBeUM7UUFDekMsNkJBQTZCO1FBQzdCLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0IsMENBQTBDO1FBQzFDLDBFQUEwRTtRQUMxRSxNQUFNO1FBQ04sSUFBSTtRQUVKLE1BQU0sNEJBQTRCLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUN4RCxJQUFJLEVBQ0osOEJBQThCLEVBQzlCO1lBQ0UsV0FBVyxFQUNULDZEQUE2RDtZQUMvRCxVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMs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Q1osYUFBYTtnQ0FDYixnREFBZ0Q7Z0NBQ2hELGlEQUFpRDs2QkFDbEQ7eUJBQ0Y7cUJBQ0Y7aUJBQ0YsQ0FBQzthQUNIO1lBQ0QsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1NBQ2pDLENBQ0YsQ0FBQztRQUVGLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxVQUFVO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF6SUQsNENBeUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIHMzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtczNcIjtcbmltcG9ydCAqIGFzIGlhbSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuXG5pbnRlcmZhY2UgRmlsZVN0b3JhZ2VTdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIGF1dGhlbnRpY2F0ZWRSb2xlOiBpYW0uSVJvbGU7XG4gIHVuYXV0aGVudGljYXRlZFJvbGU6IGlhbS5JUm9sZTtcbiAgYWxsb3dlZE9yaWdpbnM6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgRmlsZVN0b3JhZ2VTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZpbGVTdG9yYWdlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZmlsZVN0b3JhZ2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIFwiczMtYnVja2V0XCIsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgICAgY29yczogW1xuICAgICAgICB7XG4gICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IFtcbiAgICAgICAgICAgIHMzLkh0dHBNZXRob2RzLkdFVCxcbiAgICAgICAgICAgIHMzLkh0dHBNZXRob2RzLlBPU1QsXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5QVVQsXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5ERUxFVEUsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBhbGxvd2VkT3JpZ2luczogcHJvcHMuYWxsb3dlZE9yaWdpbnMsXG4gICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFtcIipcIl0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gYWxsb3cgZ3Vlc3RzIHJlYWQgYWNjZXNzIHRvIHRoZSBidWNrZXQuXG4gICAgLy8gZmlsZVN0b3JhZ2VCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShcbiAgICAvLyBcdG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAvLyBcdFx0ZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgIC8vIFx0XHRhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgIC8vIFx0XHRwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgLy8gXHRcdHJlc291cmNlczogW2Bhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wdWJsaWMvKmBdLFxuICAgIC8vIFx0fSlcbiAgICAvLyApXG5cbiAgICBjb25zdCBtYW5nZWRQb2xpY3lGb3JBbXBsaWZ5VW5hdXRoID0gbmV3IGlhbS5NYW5hZ2VkUG9saWN5KFxuICAgICAgdGhpcyxcbiAgICAgIFwibWFuZ2VkUG9saWN5Rm9yQW1wbGlmeVVuYXV0aFwiLFxuICAgICAge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIm1hbmFnZWQgcG9saWN5IHRvIGFsbG93IHVzYWdlIG9mIFN0b3JhZ2UgTGlicmFyeSBmb3IgdW5hdXRoXCIsXG4gICAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJzMzpHZXRPYmplY3RcIl0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICAgICAgYGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9L3B1YmxpYy8qYCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiczM6R2V0T2JqZWN0XCJdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wcm90ZWN0ZWQvKmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOkxpc3RCdWNrZXRcIl0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX1gXSxcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgICAgICAgIFwiczM6cHJlZml4XCI6IFtcbiAgICAgICAgICAgICAgICAgIFwicHVibGljL1wiLFxuICAgICAgICAgICAgICAgICAgXCJwdWJsaWMvKlwiLFxuICAgICAgICAgICAgICAgICAgXCJwcm90ZWN0ZWQvXCIsXG4gICAgICAgICAgICAgICAgICBcInByb3RlY3RlZC8qXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHJvbGVzOiBbcHJvcHMudW5hdXRoZW50aWNhdGVkUm9sZV0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IG1hbmdlZFBvbGljeUZvckFtcGxpZnlBdXRoID0gbmV3IGlhbS5NYW5hZ2VkUG9saWN5KFxuICAgICAgdGhpcyxcbiAgICAgIFwibWFuZ2VkUG9saWN5Rm9yQW1wbGlmeUF1dGhcIixcbiAgICAgIHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJtYW5hZ2VkIFBvbGljeSB0byBhbGxvdyB1c2FnZSBvZiBzdG9yYWdlIGxpYnJhcnkgZm9yIGF1dGhcIixcbiAgICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOlB1dE9iamVjdFwiLCBcInMzOkdldE9iamVjdFwiLCBcInMzOkRlbGV0ZU9iamVjdFwiXSxcbiAgICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHVibGljLypgLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJzMzpQdXRPYmplY3RcIiwgXCJzMzpHZXRPYmplY3RcIiwgXCJzMzpEZWxldGVPYmplY3RcIl0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICAgICAgYGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9L3Byb3RlY3RlZC9cXCR7Y29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOnN1Yn0vKmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOlB1dE9iamVjdFwiLCBcInMzOkdldE9iamVjdFwiLCBcInMzOkRlbGV0ZU9iamVjdFwiXSxcbiAgICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHJpdmF0ZS9cXCR7Y29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOnN1Yn0vKmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOkdldE9iamVjdFwiXSxcbiAgICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHJvdGVjdGVkLypgLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJzMzpMaXN0QnVja2V0XCJdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbYGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9YF0sXG4gICAgICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgICAgIFN0cmluZ0xpa2U6IHtcbiAgICAgICAgICAgICAgICBcInMzOnByZWZpeFwiOiBbXG4gICAgICAgICAgICAgICAgICBcInB1YmxpYy9cIixcbiAgICAgICAgICAgICAgICAgIFwicHVibGljLypcIixcbiAgICAgICAgICAgICAgICAgIFwicHJvdGVjdGVkL1wiLFxuICAgICAgICAgICAgICAgICAgXCJwcm90ZWN0ZWQvKlwiLFxuICAgICAgICAgICAgICAgICAgXCJwcml2YXRlLyR7Y29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOnN1Yn0vXCIsXG4gICAgICAgICAgICAgICAgICBcInByaXZhdGUvJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS8qXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHJvbGVzOiBbcHJvcHMuYXV0aGVudGljYXRlZFJvbGVdLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiQnVja2V0TmFtZVwiLCB7XG4gICAgICB2YWx1ZTogZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZSxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJCdWNrZXRSZWdpb25cIiwge1xuICAgICAgdmFsdWU6IHRoaXMucmVnaW9uLFxuICAgIH0pO1xuICB9XG59XG4iXX0=