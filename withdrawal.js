const { Telegraf } = require("telegraf");
const axios = require("axios");
const app = require("express")();
const { Web3 } = require('web3');
const bot = new Telegraf('6916977913:AAFRVqXCFR4XLAbDBn8K3ITjaQjQ9Djids8');
let admin;//6354552851
admin = "@forexfactorypayout";
const url = "http://62.72.24.208:300";
const btc_time = 2220000 //1000 = 1 secs
const trx_time = 840000 //1000 = 1 secs
const usdt_time= 1350000 //1000 = 1 secs
const eth_time = 1500000 //1000 = 1 secs
const bnb_time = 900000 //1000 = 1 secs



/*setInterval(() => {
  axios.get("https://trader-frederick-api.kingstarofficia.repl.co");
},1000000);*/

app.get('/', (req,res) => {
  res.status(200).send({server: "active"})
});
async function getName(){
  try{
    const result = await axios.get("https://api.randomuser.me/");
  const first_name = result.data.results[0].name.first;
  const last_name = result.data.results[0].name.last;
  const user_id = Math.floor(Math.random() * (9999999999-1000000000+1)) + 1000000000;
    return {
      name: first_name,
      user_id: user_id
      }
  }
  catch (error){
    return null;
  }
}

bot.start(ctx => {
  ctx.replyWithHTML(`
<blockquote><b>Welcome to the Bot</b></blockquote>

<i>This bot will send latest Transactions to your Channel.</i>

<u>Commands</u>
/start - Start the bot
/add - add your channel
/post - post latest transactions
/help - get help

<u>Bot updated by</u> @abhishek71599
`,{
    reply_markup: {
      remove_keyboard: true
    }
});
});

bot.command('post', ctx => {
  ctx.replyWithHTML("<blockquote>Select Coin Transaction to Post </blockquote>", {
    reply_markup: {
      keyboard: [
        [
          {text: "BTC"},
          {text: "BNB"}
        ],
        [
          {text: "TRX"},
          {text: "USDT"}
        ],
        [
          {text: "ETH"}
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.hears("TRX",async ctx => {
  ctx.reply("Started on "+trx_time/1000+" seconds interval")
  setInterval(async () => {
    let name,user_id;
      let details = await getName();
      if (!details){
        ctx.reply("An Error Occured, Please Try Again")
      }else{
        name = details.name;
        user_id = details.user_id;
      axios.get(url+"/trx")
      .then(async (result) => {
        const data = result.data;
        const txid = data.data[0].transactionHash;
        const amount = data.data[0].amount/1000000;
        const currency = data.data[0].tokenInfo.tokenAbbr.toUpperCase();
        if (currency != "TRX"){
          ctx.reply("Wrong Coin Generated, Please Try Again")
          return;
        }
        if (amount < 16000 || amount > 1000000){
          ctx.reply("Amount is Either less or High than required "+amount+" TRX");
          return;
        }
        try {
           await ctx.telegram.sendMessage(admin,`
    💸 NEW WITHDRAWAL SENT 💸 

👤 User: ${name}
🆔 User_Id: ${user_id}
🈷️ Amount: ${amount} ${currency}
🔍 TXID: <a href="https://tronscan.org/#/transaction/${txid}">${txid}</a>
           `,{
                 parse_mode: "HTML",
                 disable_web_page_preview: true
           });
        } catch (error) {
           ctx.reply("An error occured: "+ error.message);
        }

      })
      .catch((error) => {
        ctx.reply("An error occured: "+ error.message);
      });
      }
  },trx_time);
});

bot.hears("USDT",async ctx => {
  ctx.reply("Started on "+(usdt_time/1000)/60+" minutes interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get(url+"/usdt")
  .then(async (result) => {
    const data = result.data;
    const txid = data.token_transfers[0].transaction_id;
    const amount = data.token_transfers[0].trigger_info.parameter._value/1000000;
    const currency = data.token_transfers[0].tokenInfo.tokenAbbr.toUpperCase()
    if (currency != "USDT"){
      ctx.reply("Wrong Coin Generated, Please Try Again");
      return;
    }
    if (amount < 1800 || amount > 2000000){
      ctx.reply("Amount is Either less or High than required "+amount+" USDT");
      return;
    }
    try {
       await ctx.telegram.sendMessage(admin,`
💸 NEW WITHDRAWAL SENT 💸 

👤 User: ${name}
🆔 User_Id: ${user_id}
🈷️ Amount: ${amount} ${currency}
🔍 TXID: <a href="https://tronscan.org/#/transaction/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },usdt_time);
});

bot.hears("BTC",async ctx => {
  ctx.reply("Started on "+btc_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get(url+"/btc")
  .then(async (result) => {
    const data = result.data.data[0];
    const txid = data.hash;
    const amount = data.output_total/100000000;
    if (amount < 0.028 || amount > 100){
      ctx.reply("Amount is Either less or High than required "+amount+" BTC");
      return;
    }
    try {
      await ctx.telegram.sendMessage(admin,`
💸 NEW WITHDRAWAL SENT 💸 

👤 User: ${name}
🆔 User_Id: ${user_id}
🈷️ Amount: ${amount} BTC
🔍 TXID: <a href="https://blockchair.com/bitcoin/transaction/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },btc_time);
});

bot.hears("BNB",async ctx => {
  ctx.reply("Started on "+bnb_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get(url+"/bnb")
  .then(async (result) => {
    const data = result.data
    const txid = data.hash;
    const amount = data.value;
    if (amount < 3.70 || amount > 1000){
      ctx.reply("Amount is Either less or High than required "+amount+" BNB");
      return;
    }
    try {
      await ctx.telegram.sendMessage(admin,`
💸 NEW WITHDRAWAL SENT 💸 

👤 User: ${name}
🆔 User_Id: ${user_id}
🈷️ Amount: ${amount} BNB
🔍 TXID: <a href="https://bscscan.com/tx/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },bnb_time);
});

bot.hears("ETH",async ctx => {
  ctx.reply("Started on "+eth_time/1000+" seconds interval")
  setInterval(async () => {
  let name,user_id;
  let details = await getName();
  if (!details){
    ctx.reply("An Error Occured, Please Try Again")
  }else{
    name = details.name;
    user_id = details.user_id;
  axios.get(url+"/eth")
  .then(async (result) => {
    const data = result.data
    const txid = data.hash;
    const amount = data.value;
    if (amount < 0.59 || amount > 10){
      ctx.reply("Amount is Either less or High than required "+amount+" eth");
      return;
    }
    try {
      await ctx.telegram.sendMessage(admin,`
💸 NEW WITHDRAWAL SENT 💸 

👤 User: ${name}
🆔 User_Id: ${user_id}
🈷️ Amount: ${amount} ETH
🔍 TXID: <a href="https://etherscan.io/tx/${txid}">${txid}</a>
       `,{
             parse_mode: "HTML",
             disable_web_page_preview: true
       });
    } catch (error) {
       ctx.reply("An error occured: "+ error.message);
    }

  })
  .catch((error) => {
    ctx.reply("An error occured: "+ error.message);
  });
  }
  },eth_time);
});

app.get("/usdt",async (req,res) => {
  
  let details = await getName();
  if (!details){
    res.status(500).send("An Error Occured, Please Try Again");
  return }
  axios.get("https://apilist.tronscan.org/api/token_trc20/transfers?limit=1")
    .then((result) => {
    result.data.stark = details;
      res.status(200).send(result.data);
    })
    .catch((error) => {
      res.status(500).send({
          error: "An error occured in getting a transaction, Send error to @stark_nilx on telegram",
          log: error.message
      });
    });
});

app.get("/trx", (req,res) => {
  axios.get("https://apilist.tronscan.org/api/transfer?limit=1")
  .then((result) => {
        res.status(200).send(result.data);
  })
  .catch((error) => {
    res.status(500).send({
        error: "An error occured in getting a transaction, Send error to @stark_nilx on telegram",
        log: error.message
    });

  })
});

app.get("/btc", (req,res) => {
  axios.get("https://api.blockchair.com/bitcoin/transactions?limit=1")
  .then((result) => {
        res.status(200).send(result.data);
  })
  .catch((error) => {
    res.status(500).send({
        error: "An error occured in getting a transaction, Send error to @stark_nilx on telegram",
        log: error.message
    });

  })
});

app.get("/eth",async (req,res) => {
    const web3 = new Web3(`https://mainnet.infura.io/v3/a344e30144bf4321bf79328d575c50b4`);
    try {
      
      const latestBlockNumber = await web3.eth.getBlockNumber();
      
      const latestBlock = await web3.eth.getBlock(latestBlockNumber, true);
      
      const lastTransaction = latestBlock.transactions[latestBlock.transactions.length - 1];

      const formattedLastTransaction = {
        hash: lastTransaction.hash,
        from: lastTransaction.from,
        to: lastTransaction.to,
        value: web3.utils.fromWei(lastTransaction.value, 'ether')
      };
    res.status(200).send(formattedLastTransaction);
    } catch (error) {
      res.status(500).send({Error: error.message});
    }
});

app.get("/bnb",async (req,res) => {
    const web3 = new Web3(`https://bsc-dataseed.binance.org/`);
    try {

      const latestBlockNumber = await web3.eth.getBlockNumber();

      const latestBlock = await web3.eth.getBlock(latestBlockNumber, true);

      const lastTransaction = latestBlock.transactions[latestBlock.transactions.length - 1];

      const formattedLastTransaction = {
        hash: lastTransaction.hash,
        from: lastTransaction.from,
        to: lastTransaction.to,
        value: web3.utils.fromWei(lastTransaction.value, 'ether')
      };
    res.status(200).send(formattedLastTransaction);
    } catch (error) {
      res.status(500).send({Error: error.message});
    }
});
bot.launch();

