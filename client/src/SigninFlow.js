
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react'

const SigninFlow = () => {
    return (
        <AmplifyAuthenticator usernameAlias="email">
        <AmplifySignUp
           slot="sign-up"
           usernameAlias="email"
           formFields={[
             {
               type: "email",
               label: "Enter your email",
               placeholder: "Email",
               required: true,
              },
             {
               type: "password",
               label: "Choose a password",
               placeholder: "Password",
               required: true,
             }
            ]} 
            />
        <AmplifySignIn slot="sign-in" usernameAlias="email" />
        </AmplifyAuthenticator>
    )
}

export default SigninFlow;