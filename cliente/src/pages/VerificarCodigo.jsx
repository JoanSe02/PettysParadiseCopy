import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "../stylos/Login.css";

function VerificarCodigo({ email }) {
  console.log("VerificarCodigo renderizado");
  console.log("Email en VerificarCodigo:", email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    Swal.fire("Código Ingresado", `El código ingresado es: ${data.codigo}`, "info");
    console.log("Código ingresado:", data.codigo);
  };

  return (
    <main className="login-main">
      <div className="iz-side">
        <img
          src="/images/LogoBlanco.png"
          alt="Logo"
          className="login-logo"
        />
      </div>
      <div className="der-side">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h1>Verificar Código</h1>
          <label>
            <strong>Código de Verificación</strong>
            <input
              type="text"
              {...register("codigo", { required: "El código es obligatorio" })}
              className={errors.codigo ? "input-error" : ""}
            />
            {errors.codigo && (
              <p className="error-message">{errors.codigo.message}</p>
            )}
          </label>
          <button type="submit" className="login-submit-btn">
            Verificar Código
          </button>
        </form>
      </div>
    </main>
  );
}

export default VerificarCodigo;