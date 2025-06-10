import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { loginUser, registerUser } from "@/apis/Authapi"
export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [Login, setLogin] = useState(true)
    const [showpassword, setshowpassword] = useState(true)
    const [onLoading, setLoading] = useState(false)

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [pic, setpic] = useState<File | null>(null)
    console.log(name, email, password, pic);
    const successmsg = (msg: string) => { toast.success(msg, { icon: '👏', style: { backgroundColor: "black", color: "white" } }) };
    const errmsg = (msg:string) => {
        toast.success(msg, { icon: '🔥', style: { backgroundColor: "#d00000", color: "white" } });


    }
    const navigate = useNavigate()
    const Formdata = new FormData()

    Formdata.append("name", name);
    Formdata.append("email", email);
    Formdata.append("password", password);
    if (pic) Formdata.append("avatar", pic);

    const handleAuth = async (e: React.FormEvent) => {
          e.preventDefault();

        setLoading(true);
        

        try {
               
            if (Login) {
                const res = await loginUser({ email, password })
                if(res.data.success){
                successmsg(res.data.message)
                localStorage.setItem("token",res.data.token)
                navigate('/Home')
                
                }
                else{
                    errmsg(res.data.message)
                }
                console.log(res);



            }
            else {
                const res = await registerUser(Formdata)
                if(res.data.success){
                    successmsg(res.data.message)
                    localStorage.setItem("token",res.data.token)
                navigate('/Home')
                
                }
                else{
                    errmsg(res.data.message)
                }
                
            }
        } catch (error) {
            console.error("Frontend Error:", error);
            toast.error("Something went wrong");
        }
        finally{
            setLoading(false);
        }
    }






    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">

                                <Button variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                </Button>
                            </div>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>

                            <div className="grid gap-6">
                                {!Login && (<div className="grid gap-2">
                                    <Label htmlFor="email">Name</Label>
                                    <Input
                                    value={name}
                                        id="name"
                                        type="name"
                                        placeholder="Enter Name"
                                        required
                                        onChange={(e) => setname(e.target.value)}
                                    />
                                </div>)}

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                    value={email}
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        onChange={(e) => setemail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            
                                            className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input id="password" value={password} type={showpassword ? "text" : "password"} required onChange={(e) => setpassword(e.target.value)} />
                                    <div>
                                        <a
                                            
                                            className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                                            onClick={() => setshowpassword(!showpassword)}
                                        >
                                            {!showpassword ? "View password? " : "Close password? "}

                                        </a>
                                    </div>

                                </div>

                                {!Login && (<div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture">Picture</Label>
                                    <Input id="picture" type="file" onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        file && setpic(file)
                                    }} />

                                </div>)}


                            </div>
                            <div className="text-center text-sm">
                                {Login && ("Don't")}  have an account?{" "}
                                <a  onClick={() => setLogin(!Login)} className="underline underline-offset-4 cursor-pointer">
                                    {!Login ? ("Login") : (" Sign up")}
                                </a>
                            </div>
                            <Button disabled={onLoading} type="submit" className="w-full"  >
                                {onLoading ? (<Loader2 className="animate-spin" />) : (
                                    Login ? ("Login") : (" Sign up")
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}
