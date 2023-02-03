import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Layout from "../components/Layout";


export default function ErrorBoundary(){
    const error = useRouteError();
    let errorElement = null;
    

    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        errorElement = <div>404 - This page doesn't exist!</div>;
      }
      else if (error.status === 401) {
        errorElement = <div>401 - You aren't authorized to see this</div>;
      }
  
      else if (error.status === 503) {
        errorElement = <div>503 - Looks like our API is down</div>;
      }
      else if (error.status === 418) {
        errorElement = <div>418 - 🫖</div>;
      }
      else{
        errorElement =<div>Something went wrong!?</div>
      }
    }
  
    return (
      <Layout>
        {errorElement}
      </Layout>
    );
}