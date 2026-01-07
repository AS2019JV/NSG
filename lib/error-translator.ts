
export const translateAuthError = (errorMessage: string | undefined | null): string => {
    if (!errorMessage) return "Ha ocurrido un error inesperado.";

    const lowerMsg = errorMessage.toLowerCase();

    // Login errors
    if (lowerMsg.includes("invalid login credentials")) {
        return "Credenciales incorrectas. Por favor verifica tu correo y contraseña.";
    }
    if (lowerMsg.includes("email not confirmed")) {
        return "Tu correo electrónico no ha sido confirmado. Por favor verifica tu bandeja de entrada.";
    }
    if (lowerMsg.includes("user not found")) {
        return "No hemos encontrado una cuenta con este correo.";
    }
    if (lowerMsg.includes("password is incorrect") || lowerMsg.includes("incorrect password")) {
        return "La contraseña ingresada es incorrecta.";
    }

    // Register errors
    if (lowerMsg.includes("user already registered") || lowerMsg.includes("email already in use")) {
        return "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
    }
    if (lowerMsg.includes("password should be at least") || lowerMsg.includes("password must be at least")) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }
    if (lowerMsg.includes("unable to validate email address: invalid format") || lowerMsg.includes("validation failed for email") || lowerMsg.includes("invalid email")) {
        return "El formato del correo electrónico no es válido.";
    }
    if (lowerMsg.includes("passwords do not match")) {
        return "Las contraseñas no coinciden.";
    }

    // Generic & Network
    if (lowerMsg.includes("network error") || lowerMsg.includes("failed to fetch")) {
        return "Error de conexión. Por favor verifica tu internet.";
    }
    if (lowerMsg.includes("too many requests") || lowerMsg.includes("rate limit")) {
        return "Demasiados intentos. Por favor espera unos minutos e intenta de nuevo.";
    }
    if (lowerMsg.includes("internal server error")) {
        return "Error del servidor. Por favor intenta más tarde.";
    }

    // Default translations for simple words if they appear alone
    if (lowerMsg === "unauthorized") return "No autorizado.";
    if (lowerMsg === "forbidden") return "Acceso denegado.";

    return errorMessage;
};
