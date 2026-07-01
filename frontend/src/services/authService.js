import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from "amazon-cognito-identity-js";

import { cognitoConfig }
    from "../config/cognito";

const userPool =
    new CognitoUserPool({

        UserPoolId:
            cognitoConfig.userPoolId,

        ClientId:
            cognitoConfig.clientId
    });

export const signUpUser =
(
    email,
    password
) => {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            userPool.signUp(

                email,

                password,

                [],

                null,

                (
                    err,
                    result
                ) => {

                    if (err)
                        reject(err);

                    else
                        resolve(result);
                }
            );
        }
    );
};

export const confirmUser =
(
    email,
    code
) => {

    const user =
        new CognitoUser({

            Username:
                email,

            Pool:
                userPool
        });

    return new Promise(
        (
            resolve,
            reject
        ) => {

            user.confirmRegistration(

                code,

                true,

                (
                    err,
                    result
                ) => {

                    if (err)
                        reject(err);

                    else
                        resolve(result);
                }
            );
        }
    );
};

export const loginUser =
(
    email,
    password
) => {

    const authDetails =
        new AuthenticationDetails({

            Username:
                email,

            Password:
                password
        });

    const user =
        new CognitoUser({

            Username:
                email,

            Pool:
                userPool
        });

    return new Promise(
        (
            resolve,
            reject
        ) => {

            user.authenticateUser(

                authDetails,

                {

                    onSuccess:
                        resolve,

                    onFailure:
                        reject
                }
            );
        }
    );
};