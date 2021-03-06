window.onload=function(){

//Populate drop-down list
list=document.getElementsByName('set')[0]
for (i=0; i<data.length; i++){
  separator=document.createElement('option')
  separator.disabled=true
  separator.text=data[i].name
  list.add(separator)
  for (j=0; j<data[i].sets.length; j++){
    newset=document.createElement('option')
    newset.text=data[i].sets[j].code+" - "+data[i].sets[j].name
    newset.value=i+"-"+j
    list.add(newset)
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
        //Repick alternate art cards (e.g. EDL-005*)
        //Repick J-ruler cards (e.g. EDL-005J)
        if (["*", "J"].indexOf(ncard[ncard.length-1])==-1){
          randcards.push(ncard)
          break
        }
      }
    }
    //1 rare/sr/mr 
    //Repicks if alternate art (*), J-ruler (J) or normal ruler
    while(1==1){
      ncard=choice([].concat(tgtset.cards["R"], tgtset.cards["SR"], tgtset.cards["MR"]))
      if (["*", "J"].indexOf(ncard[ncard.length-1])==-1 && rulers.indexOf(ncard)==-1){
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
  //Set sort to default
  sort=false
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
  //Sort cards
  sortedcards=cards.slice() 
  sortedcards.sort()

  //Write HTML
  html=""
  for (i=0; i<cards.length; i++){
    html+="<img src='"+fetch(tgt[0], cards[i])+"' class='thumbnail' width='175px'>"
    if ((i+1)%8==0 && i>0 && i!=cards.length-1){
      html+="<hr/>"
    }
  }
  document.getElementById('booster').innerHTML=html

  //Update message
  if (cards.length==0){
    document.getElementById('msg').textContent="Set not available"
  }
  else{
    document.getElementById('msg').textContent="Generated "+packs+" pack"
    if (packs>1){document.getElementById('msg').textContent+="s"}
  }
  addmaglisteners()
}

//Sort button listener
document.getElementById('sort').onclick = function() {
  sort=!sort
  //Write HTML
  html=""
  for (i=0; i<cards.length; i++){
    if(sort){
      html+="<img src='"+fetch(tgt[0],sortedcards[i])+"' class='thumbnail' width='175px'>"
    }
    else{
      html+="<img src='"+fetch(tgt[0],cards[i])+"' class='thumbnail' width='175px'>"
    }
    if ((i+1)%8==0 && i>0 && !sort && i!=cards.length-1){
      html+="<hr/>"
    }
  }
  document.getElementById('booster').innerHTML=html
  document.getElementById('msg').textContent="sorted by "
  if(sort){
    document.getElementById('msg').textContent+="ID"
  }
  else{
    document.getElementById('msg').textContent+="pack order"
  }
  addmaglisteners()
}

//Export button listener. Copies the list of all cards to the clipboard
document.getElementById('export').onclick = function() {
  txtcards=""
  uniquecards=[...new Set(cards)]
  for (i=0; i<uniquecards.length; i++){
    fcount=0
    for (j=0; j<cards.length; j++){
      if (uniquecards[i]==cards[j]){fcount++}
    }
    txtcards+=fcount+" "+names[uniquecards[i]]+"\n"
  }
  navigator.clipboard.writeText(txtcards)
  document.getElementById('msg').textContent="Copied to clipboard"
}

//Magnification event
function addmaglisteners(){
  allimg=document.getElementsByClassName('thumbnail')
  for (i=0; i<allimg.length; i++){
    allimg[i].onclick=function (e){
      newheader="<center><img id='magnified' src='"+e.srcElement.src.replace("thumb","card")+"'></center><br><hr/>"
      document.getElementById('booster').innerHTML=newheader+html
      addmaglisteners()
      //Listener to remove magnification
      document.getElementById('magnified').onclick=function(){
        document.getElementById('booster').innerHTML=html
        addmaglisteners()
      }
      window.scrollTo(0,0);
    }
  }
}

}