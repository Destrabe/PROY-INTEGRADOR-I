import { Suspense } from "react";
import MensajesContent from "./mensajes";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando chat...</div>}>
      <MensajesContent />
    </Suspense>
  );
}