function handleError(response, redirect) {
  const statusCode = response.status ? response.status : 500;

  if (redirect && !window.location.pathname.includes("404")) {
    const encodedStatusCode = encodeURIComponent(statusCode);
    window.location.assign(`404?er=${encodedStatusCode}`);
  } else {
    return {
      Result: response,
      Success: false,
    }
  }
}

function calculateDuration(startTime, endTime, name) {
  const duration = endTime - startTime;
  console.info(`${name} request duration: ${duration}ms`);
};

export async function request(endpoint, options, redirect, name) {
  const startTime = performance.now();

  try {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      return handleError(response, redirect);
    }

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.startsWith("application/json")) {
      throw new Error("Invalid Content-Type");
    }

    const result = await response.json();
    
    calculateDuration(startTime, performance.now(), name);

    return {
      Result: result,
      Success: true,
    };
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      return handleError(error.response, redirect);
    }

    return handleError(error, redirect);
  }
}
