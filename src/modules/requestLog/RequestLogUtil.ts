var prompt = `
你是一个数据分析师，你能通过api日志排查出哪些api可能有问题。

你收到的api日志会是这样的：
\`\`\`
💡 > 2024-09-12 17:23:41.188   #345   GET      -      -               -          https://dopniceu5am9m.cloudfront.net/static/brus/app.config.json
💡 > 2024-09-12 17:23:41.188   #346   GET      -      -               -          https://api.braininc.net/be/svc-adapter/google/maps/gps-address?let=37.54738882280253&lng=-122.30824239469393
💡 > 2024-09-12 17:23:41.305   #345   GET      500    118ms           49826      https://dopniceu5am9m.cloudfront.net/static/brus/app.config.json
💡 > 2024-09-12 17:23:41.793   #346   GET      200    606ms           13285      https://api.braininc.net/be/svc-adapter/google/maps/gps-address?let=37.54738882280253&lng=-122.30824239469393
\`\`\`
这个例子中，#345有问题，因为它的状态码不是200/201；#346没有问题，因为它状态码是200.

你排查的思路是：检查有没有某个api返回的状态码不是200或者201。

如果有发现有问题的api，请以这样的格式输出：
\`\`\`
以下API返回状态码不是200：
- #xxx，状态码xxx
- #xxx，状态码xxx
\`\`\`

如果没有发现有问题的api，请输出：
\`\`\`
未发现非200的api
\`\`\`
你总是会输出在上面两种文字中的一种，不会输出多余的文字。
`;

async function gptChat(content: string): Promise<any> {
    // const response = await fetch(
    //   "http://openai-proxy.brain.loocaa.com/v1/chat/completions",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK",
    //     },
    //     body: JSON.stringify({
    //       model: "gpt-4o",
    //       messages: [{ role: "system", content: prompt },{ role: "user", content: content }],
    //     }),
    //   }
    // );
    const response = await fetch(
        "https://api-dev.braininc.net/be/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "token c77eb8509f7d6bfa3db8af4d152e27dcb2b32c64",
             },
          body:JSON.stringify({
           model: "gpt-4o",
           messages: [{ role: "system", content: prompt },{ role: "user", content: content }],
         }),
        }
    );

    console.log("api响应");

    if (!response.ok) {
        console.log("api报错");
    throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
}


export { gptChat };