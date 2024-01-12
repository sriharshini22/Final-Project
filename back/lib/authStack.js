"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
const aws_cognito_identitypool_alpha_1 = require("@aws-cdk/aws-cognito-identitypool-alpha");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const path = require("path");
class AuthStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id, props);
        const addUserFunc = new aws_lambda_1.Function(this, "postConfirmTriggerFunc", {
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
            handler: "addUserToDB.main",
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, "functions/postConfirmTrigger")),
            environment: {
                TABLENAME: props.userTable.tableName,
            },
        });
        const userPool = new aws_cognito_1.UserPool(this, `${props.userpoolConstructName}`, {
            selfSignUpEnabled: true,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            accountRecovery: aws_cognito_1.AccountRecovery.PHONE_AND_EMAIL,
            userVerification: {
                emailStyle: aws_cognito_1.VerificationEmailStyle.CODE,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
                givenName: {
                    required: true,
                    mutable: true,
                },
                familyName: {
                    required: true,
                    mutable: true,
                },
            },
            lambdaTriggers: {
                postConfirmation: addUserFunc,
            },
        });
        props.userTable.grantWriteData(addUserFunc);
        if (props.hasCognitoGroups) {
            (_a = props.groupNames) === null || _a === void 0 ? void 0 : _a.forEach((groupName) => new aws_cognito_1.CfnUserPoolGroup(this, `${props.userpoolConstructName}${groupName}Group`, {
                userPoolId: userPool.userPoolId,
                groupName: groupName,
            }));
        }
        const userPoolClient = new aws_cognito_1.UserPoolClient(this, `${props.userpoolConstructName}Client`, {
            userPool,
        });
        const identityPool = new aws_cognito_identitypool_alpha_1.IdentityPool(this, props.identitypoolConstructName, {
            identityPoolName: props.identitypoolConstructName,
            allowUnauthenticatedIdentities: true,
            authenticationProviders: {
                userPools: [
                    new aws_cognito_identitypool_alpha_1.UserPoolAuthenticationProvider({ userPool, userPoolClient }),
                ],
            },
        });
        this.authenticatedRole = identityPool.authenticatedRole;
        this.unauthenticatedRole = identityPool.unauthenticatedRole;
        this.userpool = userPool;
        this.identityPoolId = new aws_cdk_lib_1.CfnOutput(this, "IdentityPoolId", {
            value: identityPool.identityPoolId,
        });
        new aws_cdk_lib_1.CfnOutput(this, "UserPoolId", {
            value: userPool.userPoolId,
        });
        new aws_cdk_lib_1.CfnOutput(this, "UserPoolClientId", {
            value: userPoolClient.userPoolClientId,
        });
    }
}
exports.AuthStack = AuthStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aFN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQU1xQjtBQUNyQix5REFPaUM7QUFFakMsNEZBR2lEO0FBRWpELHVEQUE0RTtBQUM1RSw2QkFBNkI7QUFZN0IsTUFBYSxTQUFVLFNBQVEsbUJBQUs7SUFNbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjs7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUMvRCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw4QkFBOEIsQ0FBQyxDQUNyRDtZQUNELFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO1lBQ3BFLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxlQUFlLEVBQUUsNkJBQWUsQ0FBQyxlQUFlO1lBQ2hELGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsb0NBQXNCLENBQUMsSUFBSTthQUN4QztZQUNELFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2xCLEtBQUssRUFBRTtvQkFDTCxRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUUsSUFBSTtpQkFDZDtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsUUFBUSxFQUFFLElBQUk7b0JBQ2QsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7WUFDRCxjQUFjLEVBQUU7Z0JBQ2QsZ0JBQWdCLEVBQUUsV0FBVzthQUM5QjtTQUNGLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVDLElBQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLE1BQUEsS0FBSyxDQUFDLFVBQVUsMENBQUUsT0FBTyxDQUN2QixDQUFDLFNBQVMsRUFBRSxFQUFFLENBQ1osSUFBSSw4QkFBZ0IsQ0FDbEIsSUFBSSxFQUNKLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixHQUFHLFNBQVMsT0FBTyxFQUNqRDtnQkFDRSxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7Z0JBQy9CLFNBQVMsRUFBRSxTQUFTO2FBQ3JCLENBQ0YsRUFDSDtTQUNIO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSw0QkFBYyxDQUN2QyxJQUFJLEVBQ0osR0FBRyxLQUFLLENBQUMscUJBQXFCLFFBQVEsRUFDdEM7WUFDRSxRQUFRO1NBQ1QsQ0FDRixDQUFDO1FBRUYsTUFBTSxZQUFZLEdBQUcsSUFBSSw2Q0FBWSxDQUNuQyxJQUFJLEVBQ0osS0FBSyxDQUFDLHlCQUF5QixFQUMvQjtZQUNFLGdCQUFnQixFQUFFLEtBQUssQ0FBQyx5QkFBeUI7WUFDakQsOEJBQThCLEVBQUUsSUFBSTtZQUNwQyx1QkFBdUIsRUFBRTtnQkFDdkIsU0FBUyxFQUFFO29CQUNULElBQUksK0RBQThCLENBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUM7aUJBQ2pFO2FBQ0Y7U0FDRixDQUNGLENBQUM7UUFFRixJQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLGlCQUFpQixDQUFDO1FBQ3hELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxZQUFZLENBQUMsbUJBQW1CLENBQUM7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzFELEtBQUssRUFBRSxZQUFZLENBQUMsY0FBYztTQUNuQyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNoQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFVBQVU7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN0QyxLQUFLLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtTQUN2QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2R0QsOEJBdUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2ZuT3V0cHV0LFxuICBFeHBpcmF0aW9uLFxuICBSZW1vdmFsUG9saWN5LFxuICBTdGFjayxcbiAgU3RhY2tQcm9wcyxcbn0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQge1xuICBBY2NvdW50UmVjb3ZlcnksXG4gIENmblVzZXJQb29sR3JvdXAsXG4gIFVzZXJQb29sLFxuICBVc2VyUG9vbENsaWVudCxcbiAgVXNlclBvb2xPcGVyYXRpb24sXG4gIFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUsXG59IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY29nbml0b1wiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7XG4gIElkZW50aXR5UG9vbCxcbiAgVXNlclBvb2xBdXRoZW50aWNhdGlvblByb3ZpZGVyLFxufSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZ25pdG8taWRlbnRpdHlwb29sLWFscGhhXCI7XG5pbXBvcnQgeyBJUm9sZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBDb2RlLCBJRnVuY3Rpb24sIFJ1bnRpbWUsIEZ1bmN0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiO1xuXG5pbnRlcmZhY2UgQXV0aFN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgc3RhZ2U6IHN0cmluZztcbiAgcmVhZG9ubHkgdXNlcnBvb2xDb25zdHJ1Y3ROYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGhhc0NvZ25pdG9Hcm91cHM6IGJvb2xlYW47XG4gIHJlYWRvbmx5IGdyb3VwTmFtZXM/OiBzdHJpbmdbXTtcbiAgcmVhZG9ubHkgaWRlbnRpdHlwb29sQ29uc3RydWN0TmFtZTogc3RyaW5nO1xuICByZWFkb25seSB1c2VyVGFibGU6IFRhYmxlO1xufVxuXG5leHBvcnQgY2xhc3MgQXV0aFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgaWRlbnRpdHlQb29sSWQ6IENmbk91dHB1dDtcbiAgcHVibGljIHJlYWRvbmx5IGF1dGhlbnRpY2F0ZWRSb2xlOiBJUm9sZTtcbiAgcHVibGljIHJlYWRvbmx5IHVuYXV0aGVudGljYXRlZFJvbGU6IElSb2xlO1xuICBwdWJsaWMgcmVhZG9ubHkgdXNlcnBvb2w6IFVzZXJQb29sO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBdXRoU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYWRkVXNlckZ1bmMgPSBuZXcgRnVuY3Rpb24odGhpcywgXCJwb3N0Q29uZmlybVRyaWdnZXJGdW5jXCIsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgICBoYW5kbGVyOiBcImFkZFVzZXJUb0RCLm1haW5cIixcbiAgICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCBcImZ1bmN0aW9ucy9wb3N0Q29uZmlybVRyaWdnZXJcIilcbiAgICAgICksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRU5BTUU6IHByb3BzLnVzZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXNlclBvb2wgPSBuZXcgVXNlclBvb2wodGhpcywgYCR7cHJvcHMudXNlcnBvb2xDb25zdHJ1Y3ROYW1lfWAsIHtcbiAgICAgIHNlbGZTaWduVXBFbmFibGVkOiB0cnVlLFxuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYWNjb3VudFJlY292ZXJ5OiBBY2NvdW50UmVjb3ZlcnkuUEhPTkVfQU5EX0VNQUlMLFxuICAgICAgdXNlclZlcmlmaWNhdGlvbjoge1xuICAgICAgICBlbWFpbFN0eWxlOiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkNPREUsXG4gICAgICB9LFxuICAgICAgYXV0b1ZlcmlmeToge1xuICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzdGFuZGFyZEF0dHJpYnV0ZXM6IHtcbiAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBnaXZlbk5hbWU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBmYW1pbHlOYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbXV0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBsYW1iZGFUcmlnZ2Vyczoge1xuICAgICAgICBwb3N0Q29uZmlybWF0aW9uOiBhZGRVc2VyRnVuYyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBwcm9wcy51c2VyVGFibGUuZ3JhbnRXcml0ZURhdGEoYWRkVXNlckZ1bmMpO1xuXG4gICAgaWYgKHByb3BzLmhhc0NvZ25pdG9Hcm91cHMpIHtcbiAgICAgIHByb3BzLmdyb3VwTmFtZXM/LmZvckVhY2goXG4gICAgICAgIChncm91cE5hbWUpID0+XG4gICAgICAgICAgbmV3IENmblVzZXJQb29sR3JvdXAoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgYCR7cHJvcHMudXNlcnBvb2xDb25zdHJ1Y3ROYW1lfSR7Z3JvdXBOYW1lfUdyb3VwYCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdXNlclBvb2xJZDogdXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgICAgICAgICAgZ3JvdXBOYW1lOiBncm91cE5hbWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBVc2VyUG9vbENsaWVudChcbiAgICAgIHRoaXMsXG4gICAgICBgJHtwcm9wcy51c2VycG9vbENvbnN0cnVjdE5hbWV9Q2xpZW50YCxcbiAgICAgIHtcbiAgICAgICAgdXNlclBvb2wsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGlkZW50aXR5UG9vbCA9IG5ldyBJZGVudGl0eVBvb2woXG4gICAgICB0aGlzLFxuICAgICAgcHJvcHMuaWRlbnRpdHlwb29sQ29uc3RydWN0TmFtZSxcbiAgICAgIHtcbiAgICAgICAgaWRlbnRpdHlQb29sTmFtZTogcHJvcHMuaWRlbnRpdHlwb29sQ29uc3RydWN0TmFtZSxcbiAgICAgICAgYWxsb3dVbmF1dGhlbnRpY2F0ZWRJZGVudGl0aWVzOiB0cnVlLFxuICAgICAgICBhdXRoZW50aWNhdGlvblByb3ZpZGVyczoge1xuICAgICAgICAgIHVzZXJQb29sczogW1xuICAgICAgICAgICAgbmV3IFVzZXJQb29sQXV0aGVudGljYXRpb25Qcm92aWRlcih7IHVzZXJQb29sLCB1c2VyUG9vbENsaWVudCB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLmF1dGhlbnRpY2F0ZWRSb2xlID0gaWRlbnRpdHlQb29sLmF1dGhlbnRpY2F0ZWRSb2xlO1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZSA9IGlkZW50aXR5UG9vbC51bmF1dGhlbnRpY2F0ZWRSb2xlO1xuICAgIHRoaXMudXNlcnBvb2wgPSB1c2VyUG9vbDtcblxuICAgIHRoaXMuaWRlbnRpdHlQb29sSWQgPSBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiSWRlbnRpdHlQb29sSWRcIiwge1xuICAgICAgdmFsdWU6IGlkZW50aXR5UG9vbC5pZGVudGl0eVBvb2xJZCxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJVc2VyUG9vbElkXCIsIHtcbiAgICAgIHZhbHVlOiB1c2VyUG9vbC51c2VyUG9vbElkLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIlVzZXJQb29sQ2xpZW50SWRcIiwge1xuICAgICAgdmFsdWU6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==