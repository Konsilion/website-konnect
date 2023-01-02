// Mise à zéro des filtres et de la fonction de recherche avancée 'Et/Ou'

var filters = [];
var toggle = 0;
const fromDb = undefined;
//var arr_filters = [[]];
let arr_filters;


// Transformations CSV vers HTML
window.onload = function() {
    
    // -----> Filtres principaux
    Papa.parse("../data/filtres.csv", { 
        download: true,
        delimiter: ",",
        skipEmptyLines: true,
        complete: results => {
            arr_filters = results.data;
            htmlFilterGenerator(results.data);
        }
    });    
    
    // -----> Filtres secondaire
    Papa.parse("../data/s_filtres.csv", { 
        download: true,
        delimiter: ",",
        skipEmptyLines: true,
        complete: results => {
            arr_filters = arr_filters.concat(results.data);
            html_s_FilterGenerator(results.data);
        }
    }); 
    
    // -----> Données de votre liste de projet - Gridcard
    Papa.parse("../data/data.csv", { 
        download: true,
        delimiter: ";",
        skipEmptyLines: true,
        complete: results => {
            htmlGridGenerator(results.data);
        }
    });    
    
    // -----> Données de votre liste de projet - TableCsv
    Papa.parse("../data/data.csv", { 
        download: true,
        delimiter: ";",
        skipEmptyLines: true,
        complete: results => {
            htmlTableGenerator(results.data);
        }
    }); 
    
    // -----> Vos paramètres
    Papa.parse("../data/parametres.csv", { 
        download: true,
        delimiter: ";",
        skipEmptyLines: true,
        complete: results => {
            htmlParamGenerator(results.data);
        }
    });     
       
    // -----> Lancement du script starter - Ecoute des actions sur boutons par exemple
    var extra_js = document.createElement('script');

    extra_js.setAttribute('src','../backend/starter.js');

    document.head.appendChild(extra_js);
}







// ========== LES FONCTIONS DE CREATION HTML =============


// -----> Créée le filtres principaux
function htmlFilterGenerator(content) {
    
    const all = "'all'"
    
    let grid_filter = document.getElementById('grid-filter');
    
    let html = "";
    
    const data = content.slice(1);
    
    data.forEach(function(row, index) {    
        html += '<button class="neumorphic-btn filtre ' + data[index][0] + '" onclick="modifFilters(this,\'' + data[index][0] + '\')"> ' + data[index][1] + '</button>';
    });

    grid_filter.innerHTML = html;
}



// -----> Créée le filtres secondaires
function html_s_FilterGenerator(content) {

    let grid_s_filter = document.getElementById('grid-s-filter');

    let html = '';
    
    const data = content.slice(1);
    
    data.forEach(function(row, index) {    
        html += '<button class="neumorphic-btn filtre ' + data[index][0] + '" onclick="modifFilters(this,\''+ data[index][0] +'\');"> ' + data[index][1] + '</button>'
    });
     
    
    grid_s_filter.innerHTML = html;
}



// -----> Créée les gridcards depuis le fichier data.csv
function htmlGridGenerator(content) {   
    
    let grid_preview = document.getElementById('grid-preview');
    
    let html = '<div style="text-align: center; justify-content: center;"  id="grid-show" class="grid-container">';
    
    const data = content.slice(1);
    
    data.forEach(function(row, index) {
            html += '<div class="container filterDiv ' + data[index][3] + '">';
               html += '<a href="' + data[index][2] + '" target="_blank">'; 
                    html += '<div class="column_catalog">';
                        if(data[index][4] !== ""){html += '<div class="img_grid"><img class="img_card" src="' + data[index][4] + '"></div>';} else {html += '<div class="img_grid"><img class="img_card" src="https://cdn.pixabay.com/photo/2015/07/05/10/18/tree-832079__340.jpg"></div>';}
                        html += '<div class="card-title">';
                            html += '<p>' + data[index][0] + '</p>';
                        html += '</div>';
                    html += '</div>';
                html += '</a>';
                html += '<a href="' + data[index][2] + '" target="_blank"><div class="overlay"><div class="text"><p style="border-bottom:solid 1px grey;"><b>Auteur.ices : </b>' + data[index][5] + '</p><p>' + data[index][1] + '</p></div></div></a>';
            html += '</div>';
    });

    html += '</div>';

    grid_preview.innerHTML = html;
}








// -----> Creation du code HTML du tableau des données
function htmlTableGenerator(content) {

    
    let csv_preview = document.getElementById('csv-preview');

    let html = '<table id="example" class="display table table-hover table-striped align-middle" style="width:100%">';

    if (content.length == 0 || typeof(content[0]) === 'undefined') {
        return null
    } else {
        const header = content[0];
        const data = content.slice(1);

        html += '<thead class="table-dark">';
        html += '<tr>';
        header.forEach(function(colData) {
            html += '<th class="ellipsis">' + colData + '</th>';
        });
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        data.forEach(function(row) {
            if (header.length === row.length) {
                html += '<tr>';
                row.forEach(function(colData) {            
                    html += '<td class="ellipsis">' + colData + '</td>';
                });
                html += '</tr>';
            }
        });

        html += '</tbody>';
        html += '</table>';

        // insert table element into csv preview
        csv_preview.innerHTML = html;

        // initialise DataTable
        initDataTable();
    }
}
function initDataTable() {
    $('#example').dataTable({
        scrollX: true,
        scrollY: (window.innerHeight / 1.80) + "px",
        dom: 'Bfrtip',
        columnDefs: [
            { targets: [0, 1, 2, 5], visible: true},
            { targets: '_all', visible: false }
        ],
        order: [[0, 'desc']],
        buttons: [
            'colvis',
            'copy', 
            {
                extend: 'csv',
                text: 'Télécharger',
                exportOptions: {
                    columns: ':visible'
                }
            }
        ]
        
    })
}








// -----> Créée l'encadré des paramètres avancés
function htmlParamGenerator(content) {

    const data = content.slice(0);
    
    let param_zone = document.getElementById('param-zone');   
    
    let html = '<details id="param-detail" class="tip"><summary>Paramètre avancé de recherche</summary>';    
    
    // -----> Ajouter ce catalogue à votre site internet - lien iframe
    
    let ifram_code = '<code><</code><code>iframe src="' + data[1][1] +'" width="100%" height="900" frameborder="0" loading="lazy"><</code><code>/iframe></code>';
    
    html += '<details class="abstract"><summary>Utiliser ce catalogue sur votre site</summary>';
    
    html += '<ul><li><p>Voici la balise html permettant son import, largeur et hauteur sont modifiables :</p>';
    
    html += ifram_code;
    
    html += "</li><li><p>Plus d'informations et de contenus sur le dépôt git (lien en haut de cette page)</p></li></ul>";
    
    html += "</details>";
    
      
    // -----> Activer la recherche croisée - A SORTIR DE CE BLOC PARAMETRES
    
    html += '<details class="note"><summary>Activer la recherche combinée</summary>';
    
    html += '<div class="item">';
        
    html += '<p style="font-style: italic; padding-left:15px;"> • Activer la recherche dite "Ou" moins exigeante que "Et", elle recoupe plus de résultats au détriment de la précision.</p>';
        
    html += '<label id="combo-search-switch" title="Recherche combinée" class="switch"><input onclick="toggle_search_or_and();" type="checkbox"><span id="span-toggle" class="slider round"></span></label></div>';
    
    html += "</details>";   
    
    html += "</details>";
    
    param_zone.innerHTML = html;

    
    // -----> Copyright
    
    let copyright_zone = document.getElementById('copyright-zone'); 
    
    html = '<p style="margin:10px;text-align:center;color:#CAC7C7;font-size:14px;"><img style="filter: grayscale(100%);height:40px;left-margin:100px;" src="https://konsilion.fr/wp/wp-content/uploads/2022/04/Logo_Konsilion_V2-1024x325.png"><br><br>' + data[2][1] + '</p>';

    copyright_zone.innerHTML = html;
    
    
    // -----> Logo et titre
    
    let Banner = document.getElementById('Banner');
    
    //html = '<h2 style="vertical-align: middle;padding-left:15px;">Bienvenue sur la Forge de Picojoule</h2>';
    
    //Banner.innerHTML = html;
    
    // -----> Ajouter les boutons de navigation
    
    let btn_zone = document.getElementById('btn-zone'); 

    // html = '<div><button class="btn neumorphic-btn" onclick="BackBtn();"><i class="fa-regular fa-circle-left"></i>  Retour</button>';

    html = '<button class="btn neumorphic-btn" id="btn-switch" onclick="htmlTableSwitch();">Affichage tableau</button>';
    
    html += '<button class="btn neumorphic-btn" id="btn-add" onclick="HideClassSwitch(\'popup2\')"><i class="fa-solid fa-plus"></i> Ajouter un projet</button>';
    
    html += '<button class="btn neumorphic-btn" id="FilterBtn" onclick="HideShowFilters(\'filters-zone\');"><i class="fa-solid fa-filter"></i> Filtres</button>'; 
    
    html += '<button class="btn neumorphic-btn btn-reset" id="btn-reset" onclick="all_grid()"><i class="fa-solid fa-xmark"></i> Réinitialiser</button>';

    html += '<input type="text" id="myInput" onkeyup="SearchBar()" placeholder="Recherche ..." title="Type in a name"></div>';
    
    btn_zone.innerHTML = html;
}








// ========== LES FONCTIONS POUR ACTIONS SUR FILTRES DES GRIDCARDS =============


// -----> Supprime la class 'show' si existante sinon ajouter cette classe
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}



// -----> Change la valeur de la variable toggle 'Recherche Et/Ou'
function toggle_search_or_and() {
    if(toggle > 0){toggle = 0;} else {toggle = 1;};
    all_grid();
}



// -----> Affiche toute les gridcard enregistrées
function all_grid() {
  reset_grid();  
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    w3AddClass(x[i], "show")
  }
}



function reset_grid() {

    x = document.getElementsByClassName("filterDiv");
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");  
    }

    // Add or remove active class to the current button
    var btnContainer = document.getElementById("grid-s-filter");
    var btns = btnContainer.getElementsByClassName("neumorphic-btn");
    for (var i = 0; i < btns.length; i++) {   
        btns[i].className = btns[i].className.replace(" active", "");
    }
    
    // Add or remove active class to the current button
    var btnContainer = document.getElementById("grid-filter");
    var btns = btnContainer.getElementsByClassName("neumorphic-btn");
    for (var i = 0; i < btns.length; i++) {   
        btns[i].className = btns[i].className.replace(" active", "");
    }
    
    filters=[];
    
    listFilters();
}


// -----> Compare la liste des filtres en cours filters [] avec les classe des gridcards
function filterShow(c) {
    var x, i;
    //Recuperation de tous les éléments soumis à filtration 'filterDiv'  
    x = document.getElementsByClassName("filterDiv");
    if (c == "all") c = "";  
    //Recherche 'Ou'
    if(toggle > 0){
        for (i = 0; i < x.length; i++) {
            w3RemoveClass(x[i], "show");  
            for (j = 0; j < c.length; j++) {
                if (x[i].className.indexOf(c[j]) > -1) w3AddClass(x[i], "show");
            }  
        }    
    } else {
    //Recherche 'Et'
        for (i = 0; i < x.length; i++) {
            w3RemoveClass(x[i], "show");
            var arr_class = Array.from(x[i].className.split(' '));
            if (filterStrictIndex(x[i],c)==true) w3AddClass(x[i], "show");
        } 
    };  
}



// -----> Compare strictement le contenu de la liste des filtres avec les éléments 'Fonction ET'
function filterStrictIndex(x,c) {
    for (i = 0; i < c.length; i++) {
        if (x.className.indexOf(c[i]) > -1) {} else {return false}
    };
    return true;
}



// -----> Afficher ou Masquer le cadre contenant les filtres
function HideShowFilters(element) {
    document.getElementById(element).classList.toggle("show");
    document.getElementById(element).classList.toggle("hide");
    document.getElementById("FilterBtn").classList.toggle("active");
}



// -----> Je ne sais pas
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}


// -----> Je ne sais pas
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}



// -----> Montre les filtre actif par l'ajout de la classe "active"
function modifFilters(element,c) {
    // Ajouter ou supprimer filtre(s)   
    if(element.classList.contains("active")){
        // Désactiver le bouton et son filtre
        for( var i = 0; i < filters.length; i++){ 
            if ( filters[i] === c) { 
                filters.splice(i, 1); 
                i--; 
            }
        }
        w3RemoveClass(element," active");
    } else {
        //Ajout de la valeur filtre à filters variable 
        w3AddClass(element,"active");
        filters.push(c);
    }
    filterShow(filters);
    listFilters();
}






// -----> Affiche les filtres courant pour une meilleur visualisation
function listFilters(){
    
    let html = '';
    
    let filters_list = document.getElementById('filters-list');
    
    for (var i = 0, len = filters.length; i < len; i++){   
        html += '<button class="neumorphic-tag active" onclick="TagFilterClick(this,\''+ filters[i] +'\');"><i style="color: red;" class="fa-solid fa-xmark"></i>  ' + VlookUp(arr_filters, filters[i]) + '</button>';
    };
    
    filters_list.innerHTML = html;
}



// -----> Recherche vertical array
function VlookUp(arr, value){
    for (var i = 0, len = arr.length; i < len; i++){ 
        if (arr[i][0] == value) return arr[i][1];
    };
}





// -----> Recherche par nom de projet - (pas trop maitrisé mais fonctionne)
function SearchBar() {
    var input, filter, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName("filterDiv");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}





// -----> Appel la fonction dans la page parente
function BackBtn(){
   //parent.CatalogBack();
   window.open("https://picojoule.fr/", "_self"); 
    
}




// -----> permet de cliquer sur les petits filtres pour les supprimer
function TagFilterClick(element,c) {

    modifFilters(element,c);
    
    c = c + ' filtre';

    x = document.getElementsByClassName(c);
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        w3RemoveClass(x[i], "active");
    }

}



// -----> Afficher masquer la nav-bar catalogue
function ShowMobileNav() {    
    if (document.getElementById("catalog-navbar").style.display == "block"){
        document.getElementById("catalog-navbar").style.display = "none";
    } else {
        document.getElementById("catalog-navbar").style.display = "block";
    
    }
}



// -----> Afficher masquer l'affichage en tableau ou en gridcard
function htmlTableSwitch(){
    HideClassSwitch("csv-preview");
    HideClassSwitch("grid-preview");
    HideClassSwitch("FilterBtn");
    HideClassSwitch("filters-list");
    HideClassSwitch("btn-reset");
    HideClassSwitch("myInput");
    
    if(document.getElementById("FilterBtn").classList.contains("active")){
        HideClassSwitch("filters-zone");
        document.getElementById("FilterBtn").classList.toggle("active");
    }
    
    if(document.getElementById("FilterBtn").classList.contains("active")){
        HideClassSwitch("filters-zone");
        document.getElementById("FilterBtn").classList.toggle("active");
    }    
        
    if(document.getElementById("btn-switch").innerText == 'Affichage tableau'){
        document.getElementById("btn-switch").innerText = 'Affichage galerie';
    } else {
        document.getElementById("btn-switch").innerText = 'Affichage tableau';
    }
    
    
}





function HideClassSwitch(id){
    document.getElementById(id).classList.toggle("hide");
}






// ============== Fonction en essai =================







// ============== Fonction non utilisée depuis 06-09-2022 =================





// ----> Non utilisée - pour le moment, elle permettrait la gestion du Ou/Et lors de la recherche
function arraysAreIdentical(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true; 
}