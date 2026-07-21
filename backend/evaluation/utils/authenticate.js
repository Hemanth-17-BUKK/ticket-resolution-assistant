const {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} = require("amazon-cognito-identity-js");

const userPool = new CognitoUserPool({

    UserPoolId: process.env.USER_POOL_ID,

    ClientId: process.env.CLIENT_ID

});

/**
 * Authenticate a Cognito user
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
async function authenticate(email, password) {

    return new Promise((resolve, reject) => {

        const authenticationDetails =
            new AuthenticationDetails({

                Username: email,

                Password: password

            });

        const cognitoUser =
            new CognitoUser({

                Username: email,

                Pool: userPool

            });

        cognitoUser.authenticateUser(

            authenticationDetails,

            {

                onSuccess: (session) => {

                    resolve({

                        email,

                        idToken:
                            session
                                .getIdToken()
                                .getJwtToken(),

                        accessToken:
                            session
                                .getAccessToken()
                                .getJwtToken(),

                        refreshToken:
                            session
                                .getRefreshToken()
                                .getToken(),

                        expiresAt:
                            session
                                .getAccessToken()
                                .getExpiration()

                    });

                },

                onFailure: (error) => {

                    reject(

                        new Error(

                            `Authentication failed for ${email}: ${error.message}`

                        )

                    );

                },

                newPasswordRequired: () => {

                    reject(

                        new Error(

                            `User ${email} must change the password before logging in.`

                        )

                    );

                }

            }

        );

    });

}

module.exports = authenticate;