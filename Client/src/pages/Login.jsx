import  { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useRegisterUserMutation , useLoginUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Login = () => {

  const [signupInput, setSignupInput] = useState({name:"", email:"", password:""});
  const [loginInput, setLoginInput] = useState({email:"", password:""});

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

 

  const changeInputHandler = (e,type) => {
    const {name, value} = e.target;
    if(type === "signup") {
      setSignupInput({...signupInput, [name]: value});
    }
    else{
      setLoginInput({...loginInput, [name]: value});
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
    //console.log(inputData);


  };
  const navigate = useNavigate();

  useEffect(() => {
    
    if(registerIsSuccess && registerData) {
      toast.success( registerData.message || "Registration successful");
    }
    if(registerError) {
      toast.error(registerError.data.message || "Registration failed");
    }

    if(loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful");
      navigate("/"); 
    }
    if(loginError) {
      toast.error(loginError.data.message || "Login failed");
    }
    
  }, [loginIsSuccess, registerIsSuccess ,loginError, registerError,loginData, registerData ,navigate]);

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signup">Sign up</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
             Create a new account and click the button below to sign up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" value={signupInput.name} onChange={(e) => changeInputHandler(e, "signup")} placeholder="abc"   />  
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Email</Label>
              <Input type="email" name="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "signup")} placeholder="abc@gmail.com"    />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "signup")} placeholder="*****"    />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={registerIsLoading}  onClick={() => handleRegistration("signup")}>
              {
                registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait...
                  </>
                ) : "Sign up"
              }
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
         Login with your username and password after signup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input  type="email" name="email" onChange={(e) => changeInputHandler(e, "login")} placeholder="abc@gmail.com"   />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input  type="password" name="password" onChange={(e) => changeInputHandler(e, "login")} placeholder="***"   />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
              {
                loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait...
                  </>
                ) : "Login"
              }
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      </Tabs>
    </div>
  )
}
export default Login;