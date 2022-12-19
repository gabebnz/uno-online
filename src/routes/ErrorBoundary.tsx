import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorBoundary(){
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return <div>404 - This page doesn't exist!</div>;
      }
  
      if (error.status === 401) {
        return <div>401 - You aren't authorized to see this</div>;
      }
  
      if (error.status === 503) {
        return <div>503 - Looks like our API is down</div>;
      }
  
      if (error.status === 418) {
        return <div>418 - 🫖</div>;
      }
    }
  
    return <div>Something went wrong!?</div>;
}