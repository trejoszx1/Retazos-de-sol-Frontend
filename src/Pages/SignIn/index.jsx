import { useContext, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCartContext } from "../../Context";
import Layout from "../../Components/Layout";
import response from "../../services/fetchData";
import { loginAuthSchema, recoveryAuthSchema , changePasswordAuthSchema} from "../../ValidationJoi/auth";
import { createCustomerSchema } from "../../ValidationJoi/CustomerJoi";
import { AtSymbolIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const context = useContext(ShoppingCartContext);
  const [view, setView] = useState("user-info");
  const form = useRef(null);

  const [apiKey, setApiKey] = useState("");
  const [role, setRole] = useState("");
  // Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  //extrac params
  const routeInSingIn = window.location.toString();
  // Key for change password
  const key = routeInSingIn.substring(routeInSingIn.lastIndexOf("=") + 1);
  //change password
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const account = localStorage.getItem("account");
  const parsedAccount = JSON.parse(account);
  // Has an account
  const noAccountInLocalStorage = parsedAccount
    ? Object.keys(parsedAccount).length === 0
    : true;
  const noAccountInLocalState = context.account
    ? Object.keys(context.account).length === 0
    : true;
  const hasUserAnAccount = !noAccountInLocalStorage || !noAccountInLocalState;

  // Sing In Acount
  const handleSignIn = async () => {
    const userData = {
      email,
      password,
    };

    const resutl = await loginAuthSchema.validate(userData);

    await setError(resutl.error);

    if (!resutl.error) {
      const route = "/auth/login";
      const method = "POST";
      const headers = {
        "Content-Type": "application/json",
      };

      const dataFetch = {
        route,
        method,
        headers,
        body: userData,
      };

      try {
        const dataPost = await response(dataFetch);

        context.setHeaders({ "Bearer ": apiKey });

        setApiKey(await dataPost.token);
        setRole(JSON.stringify(await dataPost?.user?.role));

        localStorage.setItem("apiKey", JSON.stringify(await dataPost?.token));
        localStorage.setItem("account", JSON.stringify(await dataPost?.user));
      } catch (e) {
        setError(e);
        throw e;
      }

      const stringifiedSignOut = JSON.stringify(false);
      localStorage.setItem("sign-out", stringifiedSignOut);
      context.setSignOut(false);

      // Redirect

      navigate("/my-account");
    }
  };

  const createAnAccount = async () => {
    const formData = new FormData(form.current);
    const data = {
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      phoneNumber1: formData.get("phoneNumber1"),
      user: {
        email: formData.get("email"),
        password: formData.get("password"),
      },
    };

    const { value, error } = await createCustomerSchema.validate(data);

    setError(error);

    if (!error) {
      const route = "/customers/";
      const method = "POST";
      const headers = {
        "Content-Type": "application/json",
      };

      const dataFetch = {
        route,
        method,
        headers,
        body: value,
      };

      try {
        const res = await response(dataFetch);
        setView();
        return await res;
      } catch (error) {
        setError("Datos invalidos");
      }

      console.log("Response", await res);
    }

    //  .then((r) => {console.log(r); return r})
    //  .catch((e) => {
    //    setError(e)
    //  });

    // Create account

    //localStorage.setItem("account", stringifiedAccount);
    //context.setAccount(data);

    // navigate("/sign-in");
    //setView()
    // Sign In
    //handleSignIn();
  };

  const sendEmail = async () => {
    const resutl = await recoveryAuthSchema.validate(email);

    setError(await resutl.error);

    if (!error) {
      const route = "/auth/recovery";
      const method = "POST";
      const headers = {
        "Content-Type": "application/json",
      };

      const dataFetch = {
        route,
        method,
        headers,
        body: { email },
      };

      try {
        const dataPost = await response(dataFetch);
        console.log(dataPost);
        const result = await dataPost
        if (result == "password changed") {
          return (<h1>Contraseña cambiada</h1>);  
        }
        
      } catch (e) {
        setError(e);
        throw e;
      }

      const stringifiedSignOut = JSON.stringify(false);
      localStorage.setItem("sign-out", stringifiedSignOut);
      context.setSignOut(false);

      // Redirect

      navigate("/my-account");
    }
  };

  const recoveryPassword = async () => {

    const dataUser = {
      token: key,
      newPassword: newPassword1 ,
    }
    changePasswordAuthSchema.validate(dataUser)
    if (!(newPassword1 == newPassword2)) {
      console.log("ERRORRR");
      setError("La contraseña no concide ");
    }
  
      const dataFetch = {
        route:'/auth/change-password',
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body: { ...dataUser },
      };

      try {
        const dataPost = await response(dataFetch);
        await dataPost;
        console.log(await dataPost);
        
        setView('login')
        return (<h1>password change</h1>)
      } catch (e) {
        setError(e);
        throw e;
      }
  };

  const renderLogIn = () => {
    if (!(key == window.location.href)) {
      console.log("Set View");
      setView("change-password");
    }

    return (
      <div className="flex flex-col w-80">
        <input
          className="rounded-lg border border-black w-80 p-4 mb-4 focus:outline-none"
          value={email}
          type="text"
          placeholder={" Correo "}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded-lg border border-black w-80 p-4 mb-4 focus:outline-none"
          value={password}
          type="text"
          placeholder={" Contraseña  "}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!error == "" ? (
          <ul className="  text-red-600">tu usuario o contraseña estan mal </ul>
        ) : (
          ""
        )}
        <Link>
          <button
            className="bg-black disabled:bg-black/40 text-white  w-full rounded-lg py-3 mt-4 mb-2"
            onClick={() => handleSignIn()}
            disabled={hasUserAnAccount}
          >
            Ingresa
          </button>
        </Link>
        <div className="text-center">
          <a
            className="font-light text-xs underline underline-offset-4"
            onClick={() => setView("send-email")}
            //href="/"
          >
            ¿Olvidaste la Contraseña?
          </a>
        </div>
        <button
          className="border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3"
          onClick={() => setView("create-user-info")}
          disabled={hasUserAnAccount}
        >
          ! Registrate ¡
        </button>
      </div>
    );
  };

  const renderCreateUserInfo = () => {
    return (
      <form ref={form} className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-light text-sm">
            Nombres
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            className="rounded-lg border border-black placeholder:font-light
            placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-light text-sm">
            Apellidos
          </label>
          <input
            type="text"
            id="lastname"
            name="lastName"
            placeholder=""
            className="rounded-lg border border-black placeholder:font-light
          placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-light text-sm">
            Numero de celular
          </label>
          <input
            type="number"
            id="phoneNumber1"
            name="phoneNumber1"
            placeholder=""
            className="rounded-lg border border-black placeholder:font-light
        placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-light text-sm">
            Correo
          </label>
          <input
            type="text"
            id="email"
            name="email"
            defaultValue={parsedAccount?.email}
            placeholder="hi@helloworld.com"
            className="rounded-lg border border-black
            placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-light text-sm">
            Contraseña
          </label>
          <input
            type="text"
            id="password"
            name="password"
            defaultValue={parsedAccount?.password}
            placeholder="******"
            className="rounded-lg border border-black
            placeholder:font-light placeholder:text-sm placeholder:text-black/60 focus:outline-none py-2 px-4"
          />
        </div>
        {error ? (
          <ul className="  text-red-600">{JSON.stringify(error)}</ul>
        ) : (
          ""
        )}
        <Link>
          <button
            className="bg-black text-white w-full rounded-lg py-3"
            onClick={() => {
              createAnAccount();
            }}
          >
            Create
          </button>
        </Link>
      </form>
    );
  };
  const renderSendEmail = () => {
    return (
      <div className="flex flex-col w-80">
        <h1>Cambia tu contraseña</h1>
        <h2>Te enviaremos un correo de confirmacion </h2>
        <input
          className="rounded-lg border border-black w-80 p-4 mb-4 focus:outline-none"
          value={email}
          type="text"
          placeholder={" Correo "}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3"
          onClick={() => sendEmail()}
          //disabled={hasUserAnAccount}
        >
          Enviar codigo
        </button>
      </div>
    );
  };

  const renderPasswordChange = () => {
    return (
      <div className="flex flex-col w-80">
        <h1>Cambia tu contraseña</h1>
        <input
          className="rounded-lg border border-black w-80 p-4 mb-4 focus:outline-none"
          value={newPassword1}
          type="text"
          placeholder={"********"}
          onChange={(e) => setNewPassword1(e.target.value)}
        />
        <input
          className="rounded-lg border border-black w-80 p-4 mb-4 focus:outline-none"
          value={newPassword2}
          type="text"
          placeholder={"********"}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
        {!(newPassword1 === newPassword2) ? (
          <ul className="  text-red-600">'La contraseña no concide '</ul>
        ) : (
          ""
        )}
        <button
          className="border border-black disabled:text-black/40 disabled:border-black/40 rounded-lg mt-6 py-3"
          onClick={() => recoveryPassword()}
          //disabled={hasUserAnAccount}
        >
          Cambiar contraseña
        </button>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case "create-user-info":
        return renderCreateUserInfo();
      case "send-email":
        return renderSendEmail();
      case "change-password":
        return renderPasswordChange();
      case "login":
        return renderLogIn();
      default:
        return renderLogIn();
    }

    //return  view === "create-user-info" ? renderCreateUserInfo() : renderLogIn();
  };

  return (
    <Layout>
      <h1 className="font-medium text-xl text-center mb-6 w-80">¡ Hola !</h1>
      {renderView()}
    </Layout>
  );
};

export default SignIn;
