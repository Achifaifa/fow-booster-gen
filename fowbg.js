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
  console.log("Generating booster for "+tgtset.code)

  randcards=[]
  //New distribution
  if(["EDL", "AO1", "AO2", "AO3", "PofA", "GITS2045"].indexOf(tgtset.code)>=0){
    //6 commons
    for(j=0; j<6; j++){
      randcards.push(choice(tgtset.cards["N"]))
    }
    //1 rare/sr/mr (to-do: No ruler)
    randcards.push(choice([].concat(tgtset.cards["R"], tgtset.cards["SR"], tgtset.cards["MR"])))
    //1 foil (inc. rulers)
    randcards.push(choice([].concat(tgtset.cards["N"], tgtset.cards["R"], tgtset.cards["SR"], tgtset.cards["MR"])))
  }

  console.log("Cards in pack: ", randcards)
  return randcards
}

//Card fetcher

function fetch(clusterid, code){
  code=code.replace("*","").split('-')
  return "https://www.fowdb.altervista.org/images/thumbs/"+(8-clusterid)+"/"+code[0].toLowerCase()+"/"+code[1].replace("J","")+".jpg"
}

//Button listener
document.getElementById('generate').onclick = function() {
  selectedset=document.getElementsByName('set')[0].value;
  packs=Number(document.getElementsByName('packs')[0].value)
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
    html+="<img src='"+fetch(tgt[0],cards[i])+"' width=20%>"
    if ((i+1)%8==0 && i>0 && !sortbyid){
      html+="<hr/>"
    }
  }
  document.getElementById('booster').innerHTML=html

}



}

