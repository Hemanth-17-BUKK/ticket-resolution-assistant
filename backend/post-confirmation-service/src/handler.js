const {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand
} = require(
    "@aws-sdk/client-cognito-identity-provider"
);

const cognito =
    new CognitoIdentityProviderClient({});

exports.handler = async (event) => {

    console.log(
        "Post Confirmation Event:",
        JSON.stringify(event)
    );

    await cognito.send(
        new AdminAddUserToGroupCommand({

            UserPoolId:
                event.userPoolId,

            Username:
                event.userName,

            GroupName:
                "CUSTOMER"
        })
    );

    console.log(
        `${event.userName} added to CUSTOMER group`
    );

    return event;
};