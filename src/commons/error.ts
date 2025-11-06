import Swal from "sweetalert2";
import { setCapitalize } from "./helper";

type ZodFlattenError = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};

function formatZodErrors(error: ZodFlattenError): string {
  const fieldMessages = Object.entries(error.fieldErrors)
    .map(([field, messages]) => {
      const label = setCapitalize(field);
      return `${label}: ${messages.join(", ")}`;
    });

  const formMessages = error.formErrors.map(msg => `General: ${msg}`);

  return [...fieldMessages, ...formMessages].join("<br><br>");
}

export async function showError(
  error: unknown, 
  fallbackMessage = "Upss.. something wrong, please refresh page"
) {
	let message = fallbackMessage;
	let isHtml = false;

	if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "formErrors" in error &&
    "fieldErrors" in error
  ) {
    message = formatZodErrors(error as ZodFlattenError);
		isHtml = true;
  }

	await Swal.fire({
    title: "Error!",
    icon: "error",
    ...(isHtml ? {
			html: `<div style="text-align: left">${message}</div>`,
		} : {
			text: message,
		}),
  });
}
