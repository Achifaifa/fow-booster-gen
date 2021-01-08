window.onload=function(){

//Populate drop-down list
list=document.getElementsByName('set')[0];
for (i=0; i<data.length; i++){
  separator=document.createElement('option')
  separator.disabled=true
  separator.text=data[i].name
  list.add(separator);
  for (j=0; j<data[i].sets.length; j++){
    newset=document.createElement('option');
    newset.text=data[i].sets[j].code+" - "+data[i].sets[j].name;
    newset.value=i+"-"+j
    list.add(newset);
  }
}

//Booster generator. Returns a list of card IDs

function choice(array){
  return array[Math.floor(Math.random()*array.length)]
}

function generate(tgtdata){
  tgt=tgtdata.split("-")
  tgtcluster=data[tgt[0]].name
  tgtset=data[tgt[0]].sets[tgt[1]]
  console.log("Generating "+tgtset.code+" booster")

  randcards=[]
  //New distribution
  if(["EDL", "AO1", "AO2", "AO3", "PofA", "GITS2045"].indexOf(tgtset.code)>=0){
    //6 commons
    for(j=0; j<6; j++){
      while(1==1){
        ncard=choice(tgtset.cards["N"])
        //Filter alternate art cards (e.g. EDL-005*)
        //Filter J-ruler cards (e.g. EDL-005J)
        if (["*", "J"].indexOf(ncard[ncard.length-1])==-1){
          randcards.push(ncard)
          break
        }
      }
    }
    //1 rare/sr/mr (to-do: No ruler)
    while(1==1){
      ncard=choice([].concat(tgtset.cards["R"], tgtset.cards["SR"], tgtset.cards["MR"]))
      if (["*", "J"].indexOf(ncard[ncard.length-1])==-1){
        randcards.push(ncard)
        break
      }
    }
    //1 foil (inc. rulers)
    while(1==1){
      ncard=choice([].concat(tgtset.cards["N"], tgtset.cards["R"], tgtset.cards["SR"], tgtset.cards["MR"]))
      if (["*", "J"].indexOf(ncard[ncard.length-1])==-1){
        randcards.push(ncard)
        break
      }
    }
  }
  console.log("Cards in pack: ", randcards)
  return randcards
}

//Card image fetcher
function fetch(clusterid, code){
  code=code.split('-')
  return "https://www.fowdb.altervista.org/images/thumbs/"+(8-clusterid)+"/"+code[0].toLowerCase()+"/"+code[1]+".jpg"
}

//Generate button listener
document.getElementById('generate').onclick = function() {
  //Get info
  selectedset=document.getElementsByName('set')[0].value
  //Limit packs to 10 to prevent excessive bandwidth use
  packs=Number(document.getElementsByName('packs')[0].value)
  if (packs>10){
    document.getElementsByName('packs')[0].value="10"
    packs=10
  }
  //Generate random cards
  cards=[]
  for (i=0; i<packs; i++){
    console.log((i+1)+"/"+packs)
    cards=cards.concat(generate(selectedset))
  }
  //Sort cards if requested
  sortbyid=document.getElementsByName("sortcheck")[0].checked
  if (sortbyid){
    cards.sort()
  }
  //Write HTML
  html=""
  for (i=0; i<cards.length; i++){
    html+="<img src='"+fetch(tgt[0],cards[i])+"' width='175px'>"
    if ((i+1)%8==0 && i>0 && !sortbyid && i!=cards.length-1){
      html+="<hr/>"
    }
  }
  document.getElementById('booster').innerHTML=html
  //Update message
  document.getElementById('msg').textContent="Generated "+packs+" pack"
  if (packs>1){document.getElementById('msg').textContent+="s"}
}

//Export button listener. Copies the list of all cards to the clipboard
document.getElementById('export').onclick = function() {
  txtcards=cards.join("\n")
  navigator.clipboard.writeText(txtcards)
  document.getElementById('msg').textContent="Copied to clipboard"
}

}

