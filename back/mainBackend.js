#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const authStack_1 = require("./lib/authStack");
const fileStorageStack_1 = require("./lib/fileStorageStack");
const databaseStack_1 = require("./lib/databaseStack");
const apiStack_1 = require("./lib/apiStack");
const app = new cdk.App();
const databaseStack = new databaseStack_1.DatabaseStack(app, "DatabaseStack", {});
const authStack = new authStack_1.AuthStack(app, "AuthStack", {
    stage: "dev",
    hasCognitoGroups: true,
    groupNames: ["admin"],
    userpoolConstructName: "ChatUserPool",
    identitypoolConstructName: "ChatIdentityPool",
    userTable: databaseStack.userTable,
});
const fileStorageStack = new fileStorageStack_1.FileStorageStack(app, "FileStorageStack", {
    authenticatedRole: authStack.authenticatedRole,
    unauthenticatedRole: authStack.unauthenticatedRole,
    allowedOrigins: ["http://localhost:3000"],
});
const apiStack = new apiStack_1.APIStack(app, "AppSyncAPIStack", {
    userpool: authStack.userpool,
    roomTable: databaseStack.roomTable,
    messageTable: databaseStack.messageTable,
    userTable: databaseStack.userTable,
    unauthenticatedRole: authStack.unauthenticatedRole,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbkJhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluQmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLCtDQUE0QztBQUM1Qyw2REFBMEQ7QUFDMUQsdURBQW9EO0FBQ3BELDZDQUEwQztBQUUxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLGFBQWEsR0FBRyxJQUFJLDZCQUFhLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUVsRSxNQUFNLFNBQVMsR0FBRyxJQUFJLHFCQUFTLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRTtJQUNoRCxLQUFLLEVBQUUsS0FBSztJQUNaLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3JCLHFCQUFxQixFQUFFLGNBQWM7SUFDckMseUJBQXlCLEVBQUUsa0JBQWtCO0lBQzdDLFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztDQUNuQyxDQUFDLENBQUM7QUFFSCxNQUFNLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFO0lBQ3JFLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxpQkFBaUI7SUFDOUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLG1CQUFtQjtJQUNsRCxjQUFjLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztDQUMxQyxDQUFDLENBQUM7QUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFO0lBQ3BELFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtJQUM1QixTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7SUFDbEMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxZQUFZO0lBQ3hDLFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztJQUNsQyxtQkFBbUIsRUFBRSxTQUFTLENBQUMsbUJBQW1CO0NBQ25ELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCBcInNvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlclwiO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQXV0aFN0YWNrIH0gZnJvbSBcIi4vbGliL2F1dGhTdGFja1wiO1xuaW1wb3J0IHsgRmlsZVN0b3JhZ2VTdGFjayB9IGZyb20gXCIuL2xpYi9maWxlU3RvcmFnZVN0YWNrXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVN0YWNrIH0gZnJvbSBcIi4vbGliL2RhdGFiYXNlU3RhY2tcIjtcbmltcG9ydCB7IEFQSVN0YWNrIH0gZnJvbSBcIi4vbGliL2FwaVN0YWNrXCI7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IGRhdGFiYXNlU3RhY2sgPSBuZXcgRGF0YWJhc2VTdGFjayhhcHAsIFwiRGF0YWJhc2VTdGFja1wiLCB7fSk7XG5cbmNvbnN0IGF1dGhTdGFjayA9IG5ldyBBdXRoU3RhY2soYXBwLCBcIkF1dGhTdGFja1wiLCB7XG4gIHN0YWdlOiBcImRldlwiLFxuICBoYXNDb2duaXRvR3JvdXBzOiB0cnVlLFxuICBncm91cE5hbWVzOiBbXCJhZG1pblwiXSxcbiAgdXNlcnBvb2xDb25zdHJ1Y3ROYW1lOiBcIkNoYXRVc2VyUG9vbFwiLFxuICBpZGVudGl0eXBvb2xDb25zdHJ1Y3ROYW1lOiBcIkNoYXRJZGVudGl0eVBvb2xcIixcbiAgdXNlclRhYmxlOiBkYXRhYmFzZVN0YWNrLnVzZXJUYWJsZSxcbn0pO1xuXG5jb25zdCBmaWxlU3RvcmFnZVN0YWNrID0gbmV3IEZpbGVTdG9yYWdlU3RhY2soYXBwLCBcIkZpbGVTdG9yYWdlU3RhY2tcIiwge1xuICBhdXRoZW50aWNhdGVkUm9sZTogYXV0aFN0YWNrLmF1dGhlbnRpY2F0ZWRSb2xlLFxuICB1bmF1dGhlbnRpY2F0ZWRSb2xlOiBhdXRoU3RhY2sudW5hdXRoZW50aWNhdGVkUm9sZSxcbiAgYWxsb3dlZE9yaWdpbnM6IFtcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiXSxcbn0pO1xuXG5jb25zdCBhcGlTdGFjayA9IG5ldyBBUElTdGFjayhhcHAsIFwiQXBwU3luY0FQSVN0YWNrXCIsIHtcbiAgdXNlcnBvb2w6IGF1dGhTdGFjay51c2VycG9vbCxcbiAgcm9vbVRhYmxlOiBkYXRhYmFzZVN0YWNrLnJvb21UYWJsZSxcbiAgbWVzc2FnZVRhYmxlOiBkYXRhYmFzZVN0YWNrLm1lc3NhZ2VUYWJsZSxcbiAgdXNlclRhYmxlOiBkYXRhYmFzZVN0YWNrLnVzZXJUYWJsZSxcbiAgdW5hdXRoZW50aWNhdGVkUm9sZTogYXV0aFN0YWNrLnVuYXV0aGVudGljYXRlZFJvbGUsXG59KTtcbiJdfQ==