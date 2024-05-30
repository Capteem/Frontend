import React from "react"

const KaKaoAuthHandler = () => {
    const code = new URL(window.location.href).searchParams.get("code");
}

export default KaKaoAuthHandler