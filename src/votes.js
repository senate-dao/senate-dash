import {gql, GraphQLClient} from 'graphql-request'
import Web3 from 'web3'

let graph_url = "https://hub.snapshot.org/graphql"

async function get_votes(address,skip_interval) {
    try {
        const web3 = new Web3()
        web3.utils.toChecksumAddress(address)
    } catch (e) {
        return false
    }
    let votes = []
    const query = gql`
    {
        votes(first: 100,skip:skip_interval, where: {voter: "address"}) {
      id
      voter
      vp
      vp_state
      proposal {
        id
        state
        link
        title
        created
        end
        votes
        choices
      }
      created
      choice
      space {
        id
        name
      }
    }
    }
    `.replace("address", String(address)).replace("skip_interval",String(skip_interval*100))
    const votes_data = await make_graph_query(query)
    for (let i = 0; i < votes_data["votes"].length; i++) {
        votes.push(  {
            "voter": votes_data["votes"][i]["voter"],
            "choice": votes_data["votes"][i]["proposal"]["choices"][votes_data["votes"][i]["choice"]-1],
            "voted_on": new Date(votes_data["votes"][i]["created"]*1000),
            "proposal": {
                "id": votes_data["votes"][i]["proposal"]["id"],
                "link": votes_data["votes"][i]["proposal"]["link"],
                "title": votes_data["votes"][i]["proposal"]["title"],
                "proposal_state": votes_data["votes"][i]["proposal"]["state"],
                "proposal_create_date": new Date(votes_data["votes"][i]["proposal"]["created"]),
                "proposal_end_date": new Date(votes_data["votes"][i]["proposal"]["end"]),
                "votes_received": votes_data["votes"][i]["proposal"]["id"]["votes"]
            },
            "dao": {
                "id": votes_data["votes"][i]["space"]["id"],
                "name": votes_data["votes"][i]["space"]["name"]
            }
        })
    }

    if (votes_data["votes"].length === 100) {
        return {"votes": votes, "next": skip_interval + 1, "prev": skip_interval - 1}
    } else {
        return {"votes": votes, "prev": skip_interval - 1}
    }
}

async function make_graph_query(query) {
    const graph_client = new GraphQLClient(graph_url)
    return await graph_client.request(query)
}

async function get_dao(skip_interval) {
    // let skip_interval = 0
    // let repeat = true
    let daos = []
    // do {
    //     const query = gql`
    //     {
    //       spaces(first:1000,skip:skip_interval) {
    //         id
    //         name
    //         about
    //         network
    //         domain
    //     }
    //     }
    //     `.replace("skip_interval",String(skip_interval))
    //     const dao_data = await make_graph_query(query)
    //     print(dao_data)
    //     for (let i=0;i<dao_data["data"]["spaces"].length;i++){
    //         if (dao_data["data"]["spaces"][i]["avatar"]!==""){
    //             daos.push(  {
    //                 "dao_id": dao_data["data"]["spaces"][i]["id"],
    //                 "dao_name": dao_data["data"]["spaces"][i]["name"],
    //                 "dao_logo": dao_data["data"]["spaces"][i]["avatar"],
    //                 "dao_link": "https://snapshot.org/#/" + dao_data["data"]["spaces"][i]["id"]
    //             })
    //         }
    //     }
    //     if (dao_data["spaces"].length===1000){
    //         skip_interval +=1000
    //     }
    //     else {
    //         repeat = false
    //     }
    // }
    // while (repeat)
    const query = gql`
        {
          spaces(first:100,skip:skip_interval) {
            id
            name
            about
            network
            domain
            avatar
        }
        }
        `.replace("skip_interval", String(skip_interval * 100))
    const dao_data = await make_graph_query(query)
    for (let i = 0; i < dao_data["spaces"].length; i++) {
        if (dao_data["spaces"][i]["avatar"] !== "") {
            daos.push({
                "dao_id": dao_data["spaces"][i]["id"],
                "dao_name": dao_data["spaces"][i]["name"],
                "dao_logo": dao_data["spaces"][i]["avatar"],
                "dao_link": "https://snapshot.org/#/" + dao_data["spaces"][i]["id"]
            })
        }
    }
    if (dao_data["spaces"].length === 100) {
        return {"dao": daos, "next": skip_interval + 1, "prev": skip_interval - 1}
    } else {
        return {"dao": daos, "prev": skip_interval - 1}
    }
}

async function get_proposal(daos, skip_interval) {
    let proposals = []
    const query = `{
proposals(first: 100, skip: skip_interval ,where:{space_in:spaces_array,state:"active"}) {
    id
    link
    title
    choices
    state
    start
    end
    votes
    space {
      id
      name
    }
  }}`.replace("skip_interval", String(skip_interval * 100)).replace("spaces_array", JSON.stringify(daos))
    const proposal_active = await make_graph_query(query)
    const proposal_closed = await make_graph_query(query.replace("active", "closed"))
    const all_proposals = proposal_active["proposals"].concat(proposal_closed["proposals"])
    for (let i = 0; i < all_proposals.length; i++) {
        proposals.push({
            "proposal_id": all_proposals[i]["id"],
            "link": all_proposals[i]["link"],
            "title": all_proposals[i]["title"],
            "dao_id": all_proposals[i]["space"]["id"],
            "dao_name": all_proposals[i]["space"]["name"],
            "proposal_state": all_proposals[i]["state"],
            "proposal_create_date": new Date(all_proposals[i]["start"] * 1000),
            "proposal_end_date": new Date(all_proposals[i]["end"] * 1000),
            "votes_received": all_proposals[i]["votes"]
        })
    }
    if (proposal_active["proposals"].length === 100 || proposal_closed["proposals"].length === 100) {
        return {"proposals": proposals, "next": skip_interval + 1, "prev": skip_interval - 1}
    } else {
        return {"proposals": proposals, "prev": skip_interval - 1}

    }
}

export {get_votes,get_proposal,get_dao}
