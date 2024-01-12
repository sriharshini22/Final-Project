"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const path = require("path");
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
class APIStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new aws_appsync_alpha_1.GraphqlApi(this, "ChatApp", {
            name: "ChatApp",
            schema: aws_appsync_alpha_1.Schema.fromAsset(path.join(__dirname, "graphql/schema.graphql")),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: aws_appsync_alpha_1.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: props.userpool,
                    },
                },
            },
            logConfig: {
                fieldLogLevel: aws_appsync_alpha_1.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        const roomTableDataSource = api.addDynamoDbDataSource("RoomTableDataSource", props.roomTable);
        const messageTableDataSource = api.addDynamoDbDataSource("MessageTableDataSource", props.messageTable);
        roomTableDataSource.createResolver({
            typeName: "Mutation",
            fieldName: "createRoom",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Mutation.createRoom.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.dynamoDbResultItem(),
        });
        roomTableDataSource.createResolver({
            typeName: "Query",
            fieldName: "listRooms",
            // Can't use MappingTemplate.dynamoDbScanTable() because it's too basic for our needs👇🏽
            // https://github.com/aws/aws-cdk/blob/5e4d48e2ff12a86c0fb0177fe7080990cf79dbd0/packages/%40aws-cdk/aws-appsync/lib/mapping-template.ts#L39. I should PR this to take in an optional limit and scan 🤔
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listRooms.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listRooms.res.vtl")),
        });
        messageTableDataSource.createResolver({
            typeName: "Mutation",
            fieldName: "createMessage",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Mutation.createMessage.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.dynamoDbResultItem(),
        });
        messageTableDataSource.createResolver({
            typeName: "Query",
            fieldName: "listMessagesForRoom",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listMessagesForRoom.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listMessagesForRoom.res.vtl")),
        });
        messageTableDataSource.createResolver({
            typeName: "Mutation",
            fieldName: "updateMessage",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Mutation.updateMessage.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.dynamoDbResultItem(),
        });
        new aws_cdk_lib_1.CfnOutput(this, "GraphQLAPIURL", {
            value: api.graphqlUrl,
        });
        new aws_cdk_lib_1.CfnOutput(this, "GraphQLAPIID", {
            value: api.apiId,
        });
    }
}
exports.APIStack = APIStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMkQ7QUFHM0QsNkJBQTZCO0FBQzdCLGtFQU1vQztBQVlwQyxNQUFhLFFBQVMsU0FBUSxtQkFBSztJQUNqQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksOEJBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzFDLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFLDBCQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDeEUsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxxQ0FBaUIsQ0FBQyxTQUFTO29CQUM5QyxjQUFjLEVBQUU7d0JBQ2QsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO3FCQUN6QjtpQkFDRjthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULGFBQWEsRUFBRSxpQ0FBYSxDQUFDLEdBQUc7YUFDakM7WUFDRCxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FDbkQscUJBQXFCLEVBQ3JCLEtBQUssQ0FBQyxTQUFTLENBQ2hCLENBQUM7UUFDRixNQUFNLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FDdEQsd0JBQXdCLEVBQ3hCLEtBQUssQ0FBQyxZQUFZLENBQ25CLENBQUM7UUFFRixtQkFBbUIsQ0FBQyxjQUFjLENBQUM7WUFDakMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsc0JBQXNCLEVBQUUsbUNBQWUsQ0FBQyxRQUFRLENBQzlDLElBQUksQ0FBQyxJQUFJLENBQ1AsU0FBUyxFQUNULHNEQUFzRCxDQUN2RCxDQUNGO1lBQ0QsdUJBQXVCLEVBQUUsbUNBQWUsQ0FBQyxrQkFBa0IsRUFBRTtTQUM5RCxDQUFDLENBQUM7UUFFSCxtQkFBbUIsQ0FBQyxjQUFjLENBQUM7WUFDakMsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLFdBQVc7WUFDdEIseUZBQXlGO1lBQ3pGLHNNQUFzTTtZQUN0TSxzQkFBc0IsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0RBQWtELENBQUMsQ0FDekU7WUFDRCx1QkFBdUIsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0RBQWtELENBQUMsQ0FDekU7U0FDRixDQUFDLENBQUM7UUFFSCxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7WUFDcEMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLGVBQWU7WUFDMUIsc0JBQXNCLEVBQUUsbUNBQWUsQ0FBQyxRQUFRLENBQzlDLElBQUksQ0FBQyxJQUFJLENBQ1AsU0FBUyxFQUNULHlEQUF5RCxDQUMxRCxDQUNGO1lBQ0QsdUJBQXVCLEVBQUUsbUNBQWUsQ0FBQyxrQkFBa0IsRUFBRTtTQUM5RCxDQUFDLENBQUM7UUFDSCxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7WUFDcEMsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLHFCQUFxQjtZQUNoQyxzQkFBc0IsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDOUMsSUFBSSxDQUFDLElBQUksQ0FDUCxTQUFTLEVBQ1QsNERBQTRELENBQzdELENBQ0Y7WUFDRCx1QkFBdUIsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDL0MsSUFBSSxDQUFDLElBQUksQ0FDUCxTQUFTLEVBQ1QsNERBQTRELENBQzdELENBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7WUFDcEMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLGVBQWU7WUFDMUIsc0JBQXNCLEVBQUUsbUNBQWUsQ0FBQyxRQUFRLENBQzlDLElBQUksQ0FBQyxJQUFJLENBQ1AsU0FBUyxFQUNULHlEQUF5RCxDQUMxRCxDQUNGO1lBQ0QsdUJBQXVCLEVBQUUsbUNBQWUsQ0FBQyxrQkFBa0IsRUFBRTtTQUM5RCxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNuQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXZHRCw0QkF1R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5PdXRwdXQsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge1xuICBHcmFwaHFsQXBpLFxuICBTY2hlbWEsXG4gIEF1dGhvcml6YXRpb25UeXBlLFxuICBGaWVsZExvZ0xldmVsLFxuICBNYXBwaW5nVGVtcGxhdGUsXG59IGZyb20gXCJAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYVwiO1xuaW1wb3J0IHsgVXNlclBvb2wgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNvZ25pdG9cIjtcbmltcG9ydCB7IElSb2xlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcblxuaW50ZXJmYWNlIEFQSVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgdXNlcnBvb2w6IFVzZXJQb29sO1xuICByb29tVGFibGU6IFRhYmxlO1xuICB1c2VyVGFibGU6IFRhYmxlO1xuICBtZXNzYWdlVGFibGU6IFRhYmxlO1xuICB1bmF1dGhlbnRpY2F0ZWRSb2xlOiBJUm9sZTtcbn1cblxuZXhwb3J0IGNsYXNzIEFQSVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQVBJU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IEdyYXBocWxBcGkodGhpcywgXCJDaGF0QXBwXCIsIHtcbiAgICAgIG5hbWU6IFwiQ2hhdEFwcFwiLFxuICAgICAgc2NoZW1hOiBTY2hlbWEuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsIFwiZ3JhcGhxbC9zY2hlbWEuZ3JhcGhxbFwiKSksXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCxcbiAgICAgICAgICB1c2VyUG9vbENvbmZpZzoge1xuICAgICAgICAgICAgdXNlclBvb2w6IHByb3BzLnVzZXJwb29sLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbG9nQ29uZmlnOiB7XG4gICAgICAgIGZpZWxkTG9nTGV2ZWw6IEZpZWxkTG9nTGV2ZWwuQUxMLFxuICAgICAgfSxcbiAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgcm9vbVRhYmxlRGF0YVNvdXJjZSA9IGFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoXG4gICAgICBcIlJvb21UYWJsZURhdGFTb3VyY2VcIixcbiAgICAgIHByb3BzLnJvb21UYWJsZVxuICAgICk7XG4gICAgY29uc3QgbWVzc2FnZVRhYmxlRGF0YVNvdXJjZSA9IGFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoXG4gICAgICBcIk1lc3NhZ2VUYWJsZURhdGFTb3VyY2VcIixcbiAgICAgIHByb3BzLm1lc3NhZ2VUYWJsZVxuICAgICk7XG5cbiAgICByb29tVGFibGVEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY3JlYXRlUm9vbVwiLFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxuICAgICAgICBwYXRoLmpvaW4oXG4gICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL011dGF0aW9uLmNyZWF0ZVJvb20ucmVxLnZ0bFwiXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUmVzdWx0SXRlbSgpLFxuICAgIH0pO1xuXG4gICAgcm9vbVRhYmxlRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcImxpc3RSb29tc1wiLFxuICAgICAgLy8gQ2FuJ3QgdXNlIE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlNjYW5UYWJsZSgpIGJlY2F1c2UgaXQncyB0b28gYmFzaWMgZm9yIG91ciBuZWVkc/CfkYfwn4+9XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvYmxvYi81ZTRkNDhlMmZmMTJhODZjMGZiMDE3N2ZlNzA4MDk5MGNmNzlkYmQwL3BhY2thZ2VzLyU0MGF3cy1jZGsvYXdzLWFwcHN5bmMvbGliL21hcHBpbmctdGVtcGxhdGUudHMjTDM5LiBJIHNob3VsZCBQUiB0aGlzIHRvIHRha2UgaW4gYW4gb3B0aW9uYWwgbGltaXQgYW5kIHNjYW4g8J+klFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxuICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCBcImdyYXBocWwvbWFwcGluZ1RlbXBsYXRlcy9RdWVyeS5saXN0Um9vbXMucmVxLnZ0bFwiKVxuICAgICAgKSxcbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5Lmxpc3RSb29tcy5yZXMudnRsXCIpXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgbWVzc2FnZVRhYmxlRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogXCJNdXRhdGlvblwiLFxuICAgICAgZmllbGROYW1lOiBcImNyZWF0ZU1lc3NhZ2VcIixcbiAgICAgIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5mcm9tRmlsZShcbiAgICAgICAgcGF0aC5qb2luKFxuICAgICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgICBcImdyYXBocWwvbWFwcGluZ1RlbXBsYXRlcy9NdXRhdGlvbi5jcmVhdGVNZXNzYWdlLnJlcS52dGxcIlxuICAgICAgICApXG4gICAgICApLFxuICAgICAgcmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5keW5hbW9EYlJlc3VsdEl0ZW0oKSxcbiAgICB9KTtcbiAgICBtZXNzYWdlVGFibGVEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwibGlzdE1lc3NhZ2VzRm9yUm9vbVwiLFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxuICAgICAgICBwYXRoLmpvaW4oXG4gICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5Lmxpc3RNZXNzYWdlc0ZvclJvb20ucmVxLnZ0bFwiXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxuICAgICAgICBwYXRoLmpvaW4oXG4gICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5Lmxpc3RNZXNzYWdlc0ZvclJvb20ucmVzLnZ0bFwiXG4gICAgICAgIClcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBtZXNzYWdlVGFibGVEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwidXBkYXRlTWVzc2FnZVwiLFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxuICAgICAgICBwYXRoLmpvaW4oXG4gICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL011dGF0aW9uLnVwZGF0ZU1lc3NhZ2UucmVxLnZ0bFwiXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUmVzdWx0SXRlbSgpLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIkdyYXBoUUxBUElVUkxcIiwge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIkdyYXBoUUxBUElJRFwiLCB7XG4gICAgICB2YWx1ZTogYXBpLmFwaUlkLFxuICAgIH0pO1xuICB9XG59XG4iXX0=