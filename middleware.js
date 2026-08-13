export const config = {
  matcher: "/:path*",
};

function unauthorized() {
  return new Response("Acesso restrito.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Maria Bonita - Acesso Restrito"',
    },
  });
}

export default function middleware(request) {
  const auth = request.headers.get("authorization");
  const user = process.env.SITE_USER;
  const pass = process.env.SITE_PASSWORD;

  if (!auth) return unauthorized();

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) return unauthorized();

  const decoded = atob(encoded);
  const sepIndex = decoded.indexOf(":");
  const reqUser = decoded.slice(0, sepIndex);
  const reqPass = decoded.slice(sepIndex + 1);

  if (reqUser === user && reqPass === pass) {
    return;
  }

  return unauthorized();
}
