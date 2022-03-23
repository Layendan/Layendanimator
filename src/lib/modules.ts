export async function addModule(link: string): Promise<any> {
  try {
    const invoke = window.__TAURI__.invoke;
    let data = await invoke("add_module", {
      link: link,
    });

    try {
      // Checks status of response atm it's just hentai and will only return the status if there's an error, but when actual modules will be downloaded, it will be implemented in both success and error cases.
      let status = data.status;
      console.log("Status: ", status);
      return data;
    } catch (error2) {
      console.error(error2);
      return {
        status: "error",
        message: "Error, missing status",
        status_number: 401,
        data: null,
      };
    }

    // Hentai :)
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error while invoking tauri",
      status_number: 401,
      data: null,
    };
  }
}
