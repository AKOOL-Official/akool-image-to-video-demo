import { AuthContext } from "@/contaxt/AuthProvider";
import { ApiClient } from "@/services/apiService";
import { Label } from "@radix-ui/react-label";
import { AnimatePresence, motion } from "framer-motion";
import { Key, Loader2, Shield, XCircle } from "lucide-react";
import { useContext, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";

function AuthForm() {
  const { t } = useTranslation();
  const { setAuth, authError, setAuthError } = useContext(AuthContext);

  const [authTab, setAuthTab] = useState<"api-key" | "credentials">("api-key");
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authTab === "api-key") {
      if (!apiKey.trim()) {
        setError(t("errorEnterApiKey"));
        setLoading(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 800));
      setAuth({ type: "apiKey", credential: apiKey.trim() });
      setLoading(false);
      return;
    }

    if (!clientId.trim() || !clientSecret.trim()) {
      setError(t("errorClientCredentials"));
      setLoading(false);
      return;
    }

    try {
      const res = await ApiClient.getTokenWithClientCredentials(
        clientId.trim(),
        clientSecret.trim()
      );

      if (res?.token) {
        setAuth({ type: "token", credential: res.token });
      } else {
        setError(res.message || t("errorInvalidCredentials"));
      }
    } catch (err: any) {
      setError(err?.message || t("errorFailedGetToken"));
    }

    setLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-center justify-center w-full min-h-screen px-10">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 space-y-10">
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src="./akool-dark.svg"
                alt="Akool Logo"
                className="w-40 md:w-52 drop-shadow-[0_0_30px_var(--primary)]"
              />
              <div className="absolute inset-0 blur-3xl opacity-30 bg-primary/40"></div>
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
            >
              <span className="block text-primary">Image to Video AI Tool</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              Powerful AI tools designed for creators, developers, and
              businesses.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-full max-w-md p-10 rounded-3xl backdrop-blur-lg border border-muted  shadow-2xl z-20 mx-auto mt-10"
        >
          <ButtonGroup className="mb-6 w-full rounded-xl overflow-hidden border border-primary">
            <Button
              variant={authTab === "api-key" ? "default" : "outline"}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl"
              onClick={() => {
                setAuthTab("api-key");
                setAuthError(null);
                setError("");
              }}
            >
              <Key className="w-4 h-4" />
              {t("apiKeyTab")}
            </Button>
            <Button
              variant={authTab === "credentials" ? "default" : "outline"}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl"
              onClick={() => {
                setAuthTab("credentials");
                setAuthError(null);
                setError("");
              }}
            >
              <Shield className="w-4 h-4" />
              {t("credentialsTab")}
            </Button>
          </ButtonGroup>

          <AnimatePresence mode="wait">
            <motion.div
              key={authTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {authTab === "api-key" ? (
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="block text-left">
                    {t("apiKeyLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder={t("apiKeyPlaceholder")}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10 transition-all duration-200 rounded-xl p-5"
                      autoComplete="off"
                    />
                    <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="client-id" className="block text-left">
                      {t("clientIdLabel")}
                    </Label>
                    <Input
                      id="client-id"
                      placeholder={t("clientIdPlaceholder")}
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="transition-all duration-200 rounded-xl p-5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-secret" className="block text-left">
                      {t("clientSecretLabel")}
                    </Label>
                    <Input
                      id="client-secret"
                      type="password"
                      placeholder={t("clientSecretPlaceholder")}
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      className="transition-all duration-200 rounded-xl p-5"
                      autoComplete="off"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {(error ||
              authError) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-2 border border-destructive rounded-xl flex items-start gap-2"
                >
                  <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">
                    {error || authError}
                  </p>
                </motion.div>
              )}
          </AnimatePresence>

          <Button
            className="w-full mt-6 h-12 text-base font-medium transition-all duration-200 rounded-xl flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("loading")}
              </motion.div>
            ) : (
              t("submitButton")
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthForm;
