import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

const LoginRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      navigate("/");
    }
  }, []);

  const saveData = useMutation({
    mutationKey: "SAVEDATA",
    mutationFn: (requestData) => {
      return axios.post("http://localhost:8080/users/save", requestData, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      setFormType("login");
    },
  });

  const loginUser = useMutation({
    mutationKey: "LOGINUSER",
    mutationFn: (LoginData) => {
      return axios.post("http://localhost:8080/authenticate", LoginData);
    },
  });

  const onSubmit = (values: any) => {
    // saveData.mutate(values)
    if (formType === "register") {
      saveData.mutate(values, {
        onError(error) {
          console.error("Error during registration:", error);
          alert("User not created");
        },
      });
    } else {
      loginUser.mutate(values, {
        onSuccess(data) {
          console.log(data?.data?.data);
          localStorage.setItem("accessToken", data?.data?.data?.token);
          localStorage.setItem("userId", data?.data?.data?.userId);
          if (data.data.data.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        },
        onError(error) {
          console.error("Error during login: ", error);
          alert("Wrong Credentials");
        },
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h2">
          {formType === "login" ? "Sign in" : "Sign up"}
        </Typography>
        <form
          style={{ width: "100%", marginTop: "8px" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={2}>
            {formType === "register" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    {...register("email")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    {...register("username")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="remember"
                        color="primary"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                    }
                    label="I agree to the Terms and Conditions"
                  />
                </Grid>
              </>
            )}

            {formType !== "register" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    {...register("username")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                </Grid>
              </>
            )}
          </Grid>
          {formType === "login" && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                }
                label="Remember me"
              />
              <Link href="/ForgetPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0px 16px" }}
          >
            {formType === "login" ? "Sign In" : "Sign Up"}
          </Button>
          <Grid container>
            <Grid item>
              <Link
                onClick={() =>
                  setFormType(formType === "login" ? "register" : "login")
                }
                variant="body1"
              >
                {formType === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default LoginRegister;
