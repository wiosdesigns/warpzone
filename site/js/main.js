var db = {}
db.storage = localStorage;
db.addzone = function(zonename){
  var zones = db.storage.getItem('zones');
  var uid = '';
  if(zones){
    zones = JSON.parse(zones);
    //uid = 'z'+Date.now().toString()+Object.keys(zones).length.toString();
    uid = 'z'+Object.keys(zones).length.toString();
    zones.push(uid);
    db.storage.setItem('zones',JSON.stringify(zones)); 
  }
  else{
    zones = [];
    //uid = 'z'+Date.now().toString()+Object.keys(zones).length.toString();
    uid = 'z'+Object.keys(zones).length.toString();
    zones.push(uid);
    db.storage.setItem('zones',JSON.stringify(zones));
  }
  var zone = {
    'name':zonename,
    'categories':[]
  };
  db.storage.setItem("zone-"+uid,JSON.stringify(zone));
  return uid;
}
db.removezone = function(uid){
  var zones = db.storage.getItem('zones');
  if(zones){
    zones = JSON.parse(zones);
    for(var i = zones.length - 1; i >= 0; i--) {
      if(zones[i] === uid) {
        zones.splice(i,1);
      }
    }
    db.storage.setItem('zones',JSON.stringify(zones));
  }
  db.storage.removeItem("zone-"+uid);
  return db.getzones()
}
db.getzones = function(){
  var uids = JSON.parse(db.storage.getItem('zones'));
  if(uids==null){
    return [];
  }
  var z = [];
  for(var i=0;i<uids.length;i++){
    var zone = JSON.parse(db.storage.getItem("zone-"+uids[i]));
    zone.id = uids[i]
    z.push(zone);
  }
  return z;
}
db.getzone = function(uid){
  var zone = JSON.parse(db.storage.getItem("zone-"+uid));
  zone.id = uid;
  return zone;
}
db.savezone = function(uid,data){
  data = JSON.stringify(data);
  db.storage.setItem("zone-"+uid,data);
}
function dbtest(){
  db.storage.clear();
  
  var t = db.addzone('wios');
  db.addzone('odd1out');
  db.addzone('skyaxis');
  var r = db.addzone('randomzone1');
  console.log(db.getzones())
  db.removezone(r);
  console.log(db.getzones())
  
  
  
}

function init(){
  
  //dbtest();
  //var tid = db.addzone('testzone');
  
  Vue.component('zone-view',{
    props: ['uid'],
    template: '#zoneview-template',
    data: function(){
      var z = {}
      z.zone = db.getzone(this.uid);
      z.view = 'home';
      z.src = '';
      return z
    },
    methods:{
      save: function(){
        var z = this.zone;
        delete z['id'];
        console.log(z);
        db.savezone(this.uid,z);
      },
      remove: function(){
        db.removezone(this.uid);
        location.href="#home";
      },
      gotoiframe: function(src){
        this.src = src;
        this.view='iframe';
      },
      gotoedit: function(){
        this.view='home';
      }
    }
  });
    
  app = new Vue({
    el: "#app",
    data: {
      view: 'home',
      zones: db.getzones(),
      activezone: '',
      addzoneinput: ''
    },
    methods: {
      updatezones: function(){
        this.zones = db.getzones();
      },
      addzone: function(){
        if(this.addzoneinput!=''){
          db.addzone(this.addzoneinput);
          this.addzoneinput = '';
          this.updatezones();
        }
      },
      getzone: function(uid){
        return this.zones[uid].name;
      },
      navigate: function(){
        var hash = location.hash.slice(1);
        if(hash==""){
          hash="home";
        }
        var s = hash.split("=")
        this.view = s[0];
        if(this.view=='zone'){
          this.activezone = s[1];
        }
        this.updatezones()
      }
    }
  });
  app.navigate()
}
