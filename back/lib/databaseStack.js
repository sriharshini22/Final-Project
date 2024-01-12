"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
class DatabaseStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const userTable = new aws_dynamodb_1.Table(this, "UserTable", {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "id", type: aws_dynamodb_1.AttributeType.STRING },
        });
        const roomTable = new aws_dynamodb_1.Table(this, "RoomTable", {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "id", type: aws_dynamodb_1.AttributeType.STRING },
        });
        const messageTable = new aws_dynamodb_1.Table(this, "MessageTable", {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "id", type: aws_dynamodb_1.AttributeType.STRING },
        });
        messageTable.addGlobalSecondaryIndex({
            indexName: "messages-by-room-id",
            partitionKey: { name: "roomId", type: aws_dynamodb_1.AttributeType.STRING },
            sortKey: { name: "createdAt", type: aws_dynamodb_1.AttributeType.STRING },
        });
        const messageTableServiceRole = new aws_iam_1.Role(this, "MessageTableServiceRole", {
            assumedBy: new aws_iam_1.ServicePrincipal("dynamodb.amazonaws.com"),
        });
        messageTableServiceRole.addToPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            resources: [`${messageTable.tableArn}/index/messages-by-room-id`],
            actions: ["dymamodb:Query"],
        }));
        this.roomTable = roomTable;
        this.userTable = userTable;
        this.messageTable = messageTable;
    }
}
exports.DatabaseStack = DatabaseStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2VTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhdGFiYXNlU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTBFO0FBQzFFLDJEQUE2RTtBQUM3RSxpREFLNkI7QUFLN0IsTUFBYSxhQUFjLFNBQVEsbUJBQUs7SUFLdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFNBQVMsR0FBRyxJQUFJLG9CQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUM3QyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLFdBQVcsRUFBRSwwQkFBVyxDQUFDLGVBQWU7WUFDeEMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNLEVBQUU7U0FDekQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDN0MsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxXQUFXLEVBQUUsMEJBQVcsQ0FBQyxlQUFlO1lBQ3hDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFFO1NBQ3pELENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ25ELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtZQUN4QyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtTQUN6RCxDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsdUJBQXVCLENBQUM7WUFDbkMsU0FBUyxFQUFFLHFCQUFxQjtZQUNoQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtZQUM1RCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtTQUMzRCxDQUFDLENBQUM7UUFFSCxNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUN4RSxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQztTQUMxRCxDQUFDLENBQUM7UUFFSCx1QkFBdUIsQ0FBQyxXQUFXLENBQ2pDLElBQUkseUJBQWUsQ0FBQztZQUNsQixNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO1lBQ3BCLFNBQVMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLFFBQVEsNEJBQTRCLENBQUM7WUFDakUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7U0FDNUIsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNuQyxDQUFDO0NBQ0Y7QUFoREQsc0NBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0LCBSZW1vdmFsUG9saWN5LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgQmlsbGluZ01vZGUsIFRhYmxlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1keW5hbW9kYlwiO1xuaW1wb3J0IHtcbiAgRWZmZWN0LFxuICBQb2xpY3lTdGF0ZW1lbnQsXG4gIFJvbGUsXG4gIFNlcnZpY2VQcmluY2lwYWwsXG59IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuXG5pbnRlcmZhY2UgRGF0YWJhc2VTdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7fVxuXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IHJvb21UYWJsZTogVGFibGU7XG4gIHB1YmxpYyByZWFkb25seSB1c2VyVGFibGU6IFRhYmxlO1xuICBwdWJsaWMgcmVhZG9ubHkgbWVzc2FnZVRhYmxlOiBUYWJsZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRGF0YWJhc2VTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB1c2VyVGFibGUgPSBuZXcgVGFibGUodGhpcywgXCJVc2VyVGFibGVcIiwge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiBcImlkXCIsIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCByb29tVGFibGUgPSBuZXcgVGFibGUodGhpcywgXCJSb29tVGFibGVcIiwge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiBcImlkXCIsIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXNzYWdlVGFibGUgPSBuZXcgVGFibGUodGhpcywgXCJNZXNzYWdlVGFibGVcIiwge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYmlsbGluZ01vZGU6IEJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiBcImlkXCIsIHR5cGU6IEF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgfSk7XG5cbiAgICBtZXNzYWdlVGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoe1xuICAgICAgaW5kZXhOYW1lOiBcIm1lc3NhZ2VzLWJ5LXJvb20taWRcIixcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiBcInJvb21JZFwiLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgc29ydEtleTogeyBuYW1lOiBcImNyZWF0ZWRBdFwiLCB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWVzc2FnZVRhYmxlU2VydmljZVJvbGUgPSBuZXcgUm9sZSh0aGlzLCBcIk1lc3NhZ2VUYWJsZVNlcnZpY2VSb2xlXCIsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoXCJkeW5hbW9kYi5hbWF6b25hd3MuY29tXCIpLFxuICAgIH0pO1xuXG4gICAgbWVzc2FnZVRhYmxlU2VydmljZVJvbGUuYWRkVG9Qb2xpY3koXG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgIHJlc291cmNlczogW2Ake21lc3NhZ2VUYWJsZS50YWJsZUFybn0vaW5kZXgvbWVzc2FnZXMtYnktcm9vbS1pZGBdLFxuICAgICAgICBhY3Rpb25zOiBbXCJkeW1hbW9kYjpRdWVyeVwiXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMucm9vbVRhYmxlID0gcm9vbVRhYmxlO1xuICAgIHRoaXMudXNlclRhYmxlID0gdXNlclRhYmxlO1xuICAgIHRoaXMubWVzc2FnZVRhYmxlID0gbWVzc2FnZVRhYmxlO1xuICB9XG59XG4iXX0=