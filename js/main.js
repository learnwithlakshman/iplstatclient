
const selectId = document.querySelector("#selectData");
const baseUrl = 'https://iplstatapp.herokuapp.com/';
//const baseUrl = 'http://localhost:8080/';
//const baseUrl = "http://iplstatapp-env.eba-6zne2vkp.ap-south-1.elasticbeanstalk.com";

getLabels();

function getLabels() {
    labels = [];
    fetch(`${baseUrl}/api/v1/iplstat/labels/`)
    .then(response=>response.json())
    .then(res=>{
        labels = res["labels"];
        str = "<select onchange ='getPlayers()' id='idTeamLabel' class='form-control'>";
        str += "<option value=''>Select Team label</option>";
        for (let label of labels) {
            str += `<option value=${label}>${label}</option>`
        }
        str += "</select>";
        selectId.innerHTML = str;
    })
    
   
};

function getPlayers(){
        label = document.querySelector("#idTeamLabel").value;
        if(label.trim().length== 0)
            return ;
        else{
            players = [];
            fetch(`${baseUrl}/api/v1/iplstat/players/${label}`)
            .then(response=>response.json())
            .then(res=>{
                players = res;
                showPlayers(players);
                getPlayerCount(label);
            })
        }

}

function getPlayerCount(label){
    google.charts.load('current', {'packages':['corechart']});
     google.charts.setOnLoadCallback(drawChart);
}

function drawChart(){
    fetch(`${baseUrl}/api/v1/iplstat/rolecount/${label}`)
            .then(response=>response.json())
            .then(res=>{
        
         rows = [];
         for(let r of res){
             rows.push([r['role'],r['count']]);
         }
         var data = new google.visualization.DataTable();
        data.addColumn('string', 'Rolname');
        data.addColumn('number', 'Count');
        data.addRows(rows);

        // Set chart options
        var options = {'title':`Players count by Team : ${label}`,
                       'width':600,
                       'height':500};
                       
         var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        // Instantiate and draw our chart, passing in some options.
         function selectHandler() {
            var selectedItem = chart.getSelection()[0];
            if (selectedItem) {
              var role = data.getValue(selectedItem.row, 0);
              showPlayersByRole(label,role);
            }
          }
          google.visualization.events.addListener(chart, 'select', selectHandler);

          chart.draw(data, options);
       
      
    });
}






selectedLabel;
selectedRole;
function showPlayersByRole(label,role){
        google.charts.load('current', {'packages':['table']});
        google.charts.setOnLoadCallback(drawTable);
        selectedLabel = label;
        selectedRole = role;    
}

function drawTable(label,role) {

    fetch(`${baseUrl}/api/v1/iplstat/players/${selectedLabel}/${selectedRole}`)
    .then(response=>response.json())
    .then(res=>{
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Salary');
        data.addColumn('boolean', 'Full Time Employee');
        data.addRows([
          ['Mike',  {v: 10000, f: '$10,000'}, true],
          ['Jim',   {v:8000,   f: '$8,000'},  false],
          ['Alice', {v: 12500, f: '$12,500'}, true],
          ['Bob',   {v: 7000,  f: '$7,000'},  true]
        ]);
      
        var table = new google.visualization.Table(document.getElementById('table_div'));
      
        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    });
   
  }


function showPlayers(players){
   const idShowPlayers =  document.querySelector("#idShowPlayers");

   let str ="<table class='table table-bordered'>";
   str += "<tr><th>Name</th><th>Role</th><th>Label</th><th>Price</th></tr>";
  
   for(let player of players){
        str +=`<tr><td>${player['name']}</td><td>${player['role']}</td><td>${player['label']}</td>
        <td>${player['price']}</td></tr>`;
    }
    str +="</table>";
    idShowPlayers.innerHTML = str;
}