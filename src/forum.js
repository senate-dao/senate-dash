let forum_urls = [
  {
    forum_name: "Balancer",
    forum_link: "https://forum.balancer.fi/latest.json",
    proposal_link: "https://forum.balancer.fi/t/",
  },
  {
    forum_name: "Optimism",
    forum_link: "https://gov.optimism.io/latest.json?ascending=false",
    proposal_link: "https://gov.optimism.io/t/",
  },
  {
    forum_name: "JetProtocol",
    forum_link: "https://forum.jetprotocol.io/latest.json?ascending=false",
    proposal_link: "https://forum.jetprotocol.io/t/",
  },
];

async function get_latest_proposal() {
  var latest_prop = [];
  console.log("");
  let data = {};
  for (let i = 0; i < forum_urls.length; i++) {
    console.log(forum_urls[i]["forum_link"]);
    const response = await fetch(forum_urls[i]["forum_link"], {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // crossDomain: true,
        // "X-PINGOTHER": " pingpong",

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log("did we make it past that");
    console.log(response);
    let json = await response.json();
    latest_prop = latest_prop.concat(
      latest_prop,
      parse_response(
        json,
        forum_urls[i]["forum_name"],
        forum_urls[i]["proposal_link"]
      )
    );
  }
  return latest_prop;
}

function parse_response(response, dao_name, proposal_link) {
  var proposals = [];
  for (let i = 0; i < response["topic_list"]["topics"].length; i++) {
    if (
      response["topic_list"]["topics"][i]["title"].search("proposal") !== -1 ||
      response["topic_list"]["topics"][i]["title"].search("Proposal") !== -1 ||
      response["topic_list"]["topics"][i]["title"].search("PROPOSAL") !== -1
    ) {
      proposals.push({
        dao: dao_name,
        title: response["topic_list"]["topics"][i]["title"],
        date_created: response["topic_list"]["topics"][i]["created_at"],
        link: proposal_link + String(response["topic_list"]["topics"][i]["id"]),
      });
    }
  }
  return proposals;
}

export { get_latest_proposal };
