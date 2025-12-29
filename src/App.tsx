import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import "./App.css";
import Animator from "./components/Animator";
import AuthForm from "./components/AuthForm";
import LanguageSelector from "./components/LanguageSelector";
import Particles from "./components/Particles";
import { AuthContext, AuthProvider } from "./contaxt/AuthProvider";
import "./i18n";

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

const App = () => {
  const { auth } = useContext(AuthContext);
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden
                bg-main-gradient"
    >
      <div className="absolute top-4 right-20 z-20 backdrop-blur-xl">
        <LanguageSelector />
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait">
          {!auth && (
            <motion.div
              key="auth"
              initial={{ x: -80, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -80, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full"
            >
              <AuthForm />
            </motion.div>
          )}

          {auth && (
            <motion.div
              key="animator"
              initial={{ x: 80, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 80, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full"
            >
              <Animator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 z-10">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
    </div>
  );
};
