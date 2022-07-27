//------------------------------------------------------------------------------------------------------------------
// Import the modules we need for this example
//------------------------------------------------------------------------------------------------------------------

import {Viewer, XKTLoaderPlugin, TreeViewPlugin, AnnotationsPlugin, NavCubePlugin} from "../js/xeokit-sdk.es.js";

//------------------------------------------------------------------------------------------------------------------
// Create a Viewer and arrange the camera
//------------------------------------------------------------------------------------------------------------------

const viewer = new Viewer({
    canvasId: "myCanvas"
});

viewer.camera.eye = [1841982.5187600704, 19.207790938410042, -5173303.042326414];
viewer.camera.look = [1842011.793756829, 9.913817421536704, -5173299.841616623];
viewer.camera.up =[0.2991762376746394, 0.9536370664170352, 0.0327096983532173];

new NavCubePlugin(viewer, {
    canvasId: "myNavCubeCanvas",
    color: "lightblue",
    visible: true,           // Initially visible (default)
    cameraFly: true,       // Fly camera to each selected axis/diagonal
    cameraFitFOV: 45,        // How much field-of-view the scene takes once camera has fitted it to view
    cameraFlyDuration: 0.5 // How long (in seconds) camera takes to fly to each new axis/diagonal
});

//------------------------------------------------------------------------------------------------------------------
// Load a model
//------------------------------------------------------------------------------------------------------------------

const xktLoader = new XKTLoaderPlugin(viewer);

const sceneModel = xktLoader.load({
    id: "myModel",
    src: "models/xkt/MAP.gltf.xkt",
    edges: true
});

//------------------------------------------------------------------------------------------------------------------
// Create an IFC structure tree view
//------------------------------------------------------------------------------------------------------------------

const treeView = new TreeViewPlugin(viewer, {
    containerElement: document.getElementById("treeViewContainer2"),
    autoExpandDepth: 4 // Initially expand tree three nodes deep
});

viewer.cameraControl.on("picked", function (e) {
    var objectId = e.entity.id;
    //0CE_ueYG1Fz8ko02YM2bQX
    console.log("e : ", e)
    console.log("entity : ", e.entity)
    console.log("id : ", e.entity.id)
    treeView.showNode(objectId);
    //console.log($("#1" + e.entity.id).closest("span"))    
});

let jsonData = [];


sceneModel.on("loaded", () => {
    $("#treeViewContainer2 li").each((id, elem) => {
        //console.log("elem : ", elem)
        //console.log("length : ", elem.children.length)
        if(elem.children.length == 4) {
            //console.log("elem : ", elem)
        }
        //console.log(elem.innerHTML)
        //console.log(elem.firstElementChild.id)
        //console.log(elem.children[1].textContent)
        
        //console.log(elem.children[2].textContent)

        if(elem.children.length == 2){
            //console.log(elem.children[1].textContent)
            //console.log(elem.firstElementChild.id.substr(1))
            //console.log(elem.children.length)
            jsonData.push({"nom" : elem.children[1].textContent, "id" : elem.firstElementChild.id.substr(1)})
        }
        else {
            //console.log(elem.children[1].id.substr(1))
            //console.log(elem.children[2].textContent)
            //console.log(elem.children.length)
            jsonData.push({"nom" : elem.children[2].textContent, "id" : elem.children[1].id.substr(1)})
        }

        
        
        //console.log("---------------")
    })

    //JSON du treeView
    var obj = FetchChild();

    

    //console.log(findChildrenForK(obj, "3toKckUfH2jBmd$7xKikH0"))
    //console.log(obj)
    //console.log(test)
    //console.log(obj.name)
    //console.log(jsonData)

    //Gere l'autocompletion dans la zone de recherche
    $('#searchbar').on('keyup', function() {
        let input = document.getElementById('searchbar').value
        input = input.toLowerCase();
        let x = document.querySelector('#listholder');
        x.innerHTML = ""
      
        for (i = 0; i < jsonData.length; i++) {
          let obj = jsonData[i];
      
          if (obj.nom.toLowerCase().includes(input)) {
            const elem = document.createElement("li")
            elem.innerHTML = `${obj.nom} - ${obj.id}`
            elem.id = obj.id
            x.appendChild(elem)
            
          }
        }
    })

    //Gere le click de la réponse avec la zone de recherche
    $('#treeViewContainer').on('click', 'li', function (e) {
        // snip...
        //console.log(e.target.id)
        const scene = viewer.scene;
        var objectIds = [];
        var tabChild = [];
        var tabParent = [];
        if(findChildrenForK(obj, e.target.id) !== undefined) {
            console.log("oui")
            tabParent.push(e.target.id);
            tabChild = findChildrenForK(obj, e.target.id)
            objectIds = tabParent.concat(tabChild);
        }
        else {
            console.log("aucune valeur")
            objectIds.push(e.target.id);
        }
        //objectIds.push(e.target.id);
        //console.log(findChildrenForK(obj, e.target.id))
        console.log(objectIds)
        scene.setObjectsXRayed(scene.objectIds, true);
        scene.setObjectsVisible(scene.objectIds, true);
        scene.setObjectsXRayed(objectIds, false);
        viewer.cameraFlight.flyTo({
            aabb: scene.getAABB(objectIds),
            duration: 0.5
        }, () => {
            setTimeout(function () {
                scene.setObjectsVisible(scene.xrayedObjectIds, false);
                scene.setObjectsXRayed(scene.xrayedObjectIds, false);
            }, 500);
        });
    });
})




//------------------------------------------------------------------------------------------------------------------
// Create an AnnotationsPlugin, with which we'll create annotations
//------------------------------------------------------------------------------------------------------------------

const annotations = new AnnotationsPlugin(viewer, {

    markerHTML: "<div class='annotation-marker' id='annotation-marker' style='background-color: {{markerBGColor}};'>{{glyph}}</div>",
    labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'><div class='annotation-title'>{{title}}</div><div class='annotation-desc'>{{description}}</div></div>",

    values: {
        markerBGColor: "red",
        glyph: "X",
        title: "Untitled",
        description: "No description"
    },

    surfaceOffset: 0.3
});

annotations.on("markerMouseEnter", (annotation) => {
    annotation.setLabelShown(true);
});

annotations.on("markerMouseLeave", (annotation) => {
    annotation.setLabelShown(false);
});

annotations.on("markerClicked", (annotation) => {
    //annotation.setLabelShown(!annotation.getLabelShown());
    Swal.fire({
        title: 'Voulez-vous vraiment supprimer l\'annotation ?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Oui',
        denyButtonText: 'Non',
        confirmButtonColor: "#3085d6",
        customClass: {
          actions: 'my-actions',
          confirmButton: 'order-1',
          denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(this).remove()
            annotations.destroyAnnotation(annotation.id)
            Toast.fire({
                icon: 'success',
                title: 'L\'annotation a bien été supprimée'
            })
            //Reset de la partie pour copier et prendre des screenshot
            while (snapshots.firstChild) {
                snapshots.removeChild(snapshots.lastChild);
            }
            document.getElementById('elementcopier').style.display = "none";
            divelementcopier = ""
        } else if (result.isDenied) {
            //Swal.fire('Changes are not saved', '', 'info')
        }
    })
});

//------------------------------------------------------------------------------------------------------------------
// Use the AnnotationsPlugin to create an annotation wherever we click on an object
//------------------------------------------------------------------------------------------------------------------

var i = 0;
var titre = "";
var description = "";
var imageSource;
var image;
var logoAnnotation;
var colorAnnotation;
var divelementcopier = document.getElementById('elementcopier').innerHTML;
var snapshots = document.getElementById('elementcopier');

const myModal = new bootstrap.Modal(document.getElementById('myModal'))


viewer.scene.input.on("mouseclicked", (coords) => {

    const pickResult = viewer.scene.pick({
        canvasPos: coords,
        pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
    });
    

    if (pickResult) {
        myModal.show()
        
        viewer.scene.input.setEnabled(false);

        //Reset de la partie pour copier et prendre des screenshot
        while (snapshots.firstChild) {
            snapshots.removeChild(snapshots.lastChild);
        }
        document.getElementById('elementcopier').style.display = "none";
        divelementcopier = ""


        //Gère l'ouverture du modal
        $("#submit").click(function() {

            const pickResult = viewer.scene.pick({
                canvasPos: coords,
                pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
            });

            console.log("pickresult.id : ", pickResult.entity.id)
            
            //Recuperation des valeurs entrées par l'utilisateur
            $("#inputs").each(function() {
                titre = $("#titreannotation option:selected").text();
                description = $("#descriptionannotation").val();
                image = $("#formFile").get(0).files
            });

            if(titre == "Fuite d'eau"){
                logoAnnotation = "F"
                colorAnnotation = "blue"
                
            }
            else if (titre == "Dégradation"){
                logoAnnotation = "D"
                colorAnnotation = "red"
            }
            else {
                logoAnnotation = "X"
                colorAnnotation = "black"
            }
            

            

            const annotation = annotations.createAnnotation({
                id:"myAnnotation" + i,
                worldPos:[pickResult.worldPos[0], pickResult.worldPos[1], pickResult.worldPos[2]],
                occludable: false,
                markerShown: true,
                labelShown: false,
                labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                    <div class='annotation-title'>{{title}}</div>\
                    <div class='annotation-desc'>{{description}}</div>\
                    <br><img alt='myImage' width='150px' height='100px' src='{{imageSrc}}'>\
                    </div>",
                values: {
                    glyph: logoAnnotation,
                    title: titre,
                    description: description,
                    markerBGColor: colorAnnotation,
                    //imageSrc: URL.createObjectURL(image[0])
                    //imageSrc: imageSource
                },

            })
            console.log(annotation)
            

            if (image.length !== 0){
                console.log(annotation.plugin)
                imageSource = URL.createObjectURL(image[0])
                annotation.setValues({imageSrc: imageSource})
            }
            else {
                annotation._labelHTML = "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                <div class='annotation-title'>{{title}}</div>\
                <div class='annotation-desc'>{{description}}</div>\
                </div>"
            }

            //Régle le probleme des annotations qui se créée en plus lorsqu'on clique sur le modal
            var idannotation = Object.keys(annotations.annotations);
            idannotation.forEach((t) => {
                if(t.startsWith("__")){
                    annotations.destroyAnnotation(t)
                }
            })
            $("#myModal").hide(); 
            $("#inputs")[0].reset();
            viewer.scene.input.setEnabled(true);

            

        });

        $("#partageImg").click(function() {
            const pickResult = viewer.scene.pick({
                canvasPos: coords,
                pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
            });

            console.log("pickresult : ", pickResult)
            
            //Recuperation des valeurs entrées par l'utilisateur
            $("#inputs").each(function() {
                titre = $("#titreannotation option:selected").text();
                description = $("#descriptionannotation").val();
                image = $("#formFile").get(0).files
            });

            if(titre == "Fuite d'eau"){
                logoAnnotation = "F"
                colorAnnotation = "blue"
                
            }
            else if (titre == "Dégradation"){
                logoAnnotation = "D"
                colorAnnotation = "red"
            }
            else {
                logoAnnotation = "X"
                colorAnnotation = "black"
            }
            

            

            const annotation = annotations.createAnnotation({
                id:"myAnnotation" + i,
                worldPos:[pickResult.worldPos[0], pickResult.worldPos[1], pickResult.worldPos[2]],
                occludable: false,
                markerShown: true,
                labelShown: false,
                labelHTML: "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                    <div class='annotation-title'>{{title}}</div>\
                    <div class='annotation-desc'>{{description}}</div>\
                    <br><img alt='myImage' width='150px' height='100px' src='{{imageSrc}}'>\
                    </div>",
                values: {
                    glyph: logoAnnotation,
                    title: titre,
                    description: description,
                    markerBGColor: colorAnnotation,
                    //imageSrc: URL.createObjectURL(image[0])
                    //imageSrc: imageSource
                },
            })

            console.log("annotation : ", annotation)
            
            

            if (image.length !== 0){
                imageSource = URL.createObjectURL(image[0])
                annotation.setValues({imageSrc: imageSource})
            }
            else {
                annotation._labelHTML = "<div class='annotation-label' style='background-color: {{labelBGColor}};'>\
                <div class='annotation-title'>{{title}}</div>\
                <div class='annotation-desc'>{{description}}</div>\
                </div>"
            }
            

            //Régle le probleme des annotations qui se créée en plus lorsqu'on clique sur le modal
            var idannotation = Object.keys(annotations.annotations);
            idannotation.forEach((t) => {
                if(t.startsWith("__")){
                    annotations.destroyAnnotation(t)
                }
            })
            
            
            
            var canvas2 = document.getElementById("myCanvas2");
            canvas2.width = document.documentElement.clientWidth
            canvas2.height = document.documentElement.clientHeight
            var ctx1 = canvas2.getContext("2d");
            ctx1.strokeStyle = 'black';
            ctx1.fillStyle = 'rgba(0,0,0,0.3)';
            ctx1.beginPath();
            ctx1.arc(coords[0], coords[1], 10, 0, 2 * Math.PI, false);
            ctx1.stroke();
            ctx1.fill();

            var element = document.getElementById("myCanvas");
            
            //Creation du merge des 2 images
            var mergeimage = mergeImages([element.toDataURL(), canvas2.toDataURL()]).then(
                b64 => document.getElementById("image").src = b64
            )
            //mergeimage.then(datasrc => writeToClipboard(dataURItoBlob(datasrc)))

            //Création du blob de la photo à partir du src de l'image
            function dataURItoBlob(dataURI) {
                // convert base64 to raw binary data held in a string
                // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
                var byteString = atob(dataURI.split(',')[1]);
              
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
              
                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);
              
                // create a view into the buffer
                var ia = new Uint8Array(ab);
              
                // set the bytes of the buffer to the correct values
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
              
                // write the ArrayBuffer to a blob, and you're done
                var blob = new Blob([ab], {type: mimeString});
                return blob;
              
            }

            //Copie dans le presse-papier
            async function writeToClipboard(imageBlob) {
                try {
                  await navigator.clipboard.write([
                    new ClipboardItem({
                      'image/png': imageBlob,
                    }),
                  ]);
                } catch (error) {
                  console.error(error);
                }
            }

            
            
            document.getElementById('elementcopier').style.display = "";
            
            
            //Transormer l'importation de l'image du modal en base64
            var reader = new FileReader();
            console.log("image[0] : ", image)
            reader.readAsDataURL(image[0]); 
            reader.onload = function() {
                var base64data = reader.result;            
                //console.log(dataURItoBlob(base64data)) //Creation du blob de l'image de l'annotation
            
                
                divelementcopier += '<h1>kwarto BIM Explorer</h1>'
                divelementcopier += '<p>Photo de l\'annotation : </p>\n';
                divelementcopier += '<img src="'+base64data+'" />\n';
                divelementcopier += '<p>Titre de l\'annotation : ' + titre + '</p>\n';
                divelementcopier += '<p>Description de l\'annotation : ' + description + '</p><br>';
                divelementcopier += '<img src="'+document.getElementById("image").src+'" id="imgclick" style="width: 330px;"/>\n';
                divelementcopier += '<button id="screenshot" type="button" class="btn btn-primary">Prendre un screenshot</button>'
                
                snapshots.appendChild(createElement(divelementcopier))
                document.getElementById('screenshot').textContent = "";
                let blob = new Blob([snapshots.innerHTML], {type: 'text/html'});
                writeToClipboard2(blob)
                document.getElementById('screenshot').textContent = "Prendre un screenshot"
                




                /* const toastLiveExample = document.getElementById('copyToast')
                const toast = new bootstrap.Toast(toastLiveExample)
                toast.show() */
                Toast.fire({
                    icon: 'success',
                    title: 'La sélection a bien été copiée dans le presse papier'
                })
                
                $("#copier").click(function() {
                    //Supprime les boutons copier et screenshot
                    //document.getElementById('copier').remove();
                    document.getElementById('screenshot').remove();
                    let blob = new Blob([snapshots.innerHTML], {type: 'text/html'});
                    writeToClipboard2(blob)

                    while (snapshots.firstChild) {
                        snapshots.removeChild(snapshots.lastChild);
                    }
                    document.getElementById('elementcopier').style.display = "none";

                    
                    /* var bcopy = document.createElement('button');
                    bcopy.id = 'copier'
                    bcopy.type = 'button'
                    bcopy.className = 'btn btn-primary'
                    bcopy.innerHTML = 'Copier'
                    snapshots.appendChild(bcopy) */


                    
                    /* const toastLiveExample = document.getElementById('copyToast')
                    const toast = new bootstrap.Toast(toastLiveExample)
                    toast.show() */
                    Toast.fire({
                        icon: 'success',
                        title: 'La sélection a bien été copiée dans le presse papier'
                    })
                    
                })

                $("#screenshot").click(function() {
                    var buttonscreeshot = document.getElementById('screenshot')
                    var mergeimg = mergeImages([element.toDataURL(), canvas2.toDataURL()]).then(
                        b64 => document.getElementById("image").src = b64
                    )
                    var img = document.createElement('img');
                    mergeimg.then(
                        result => img.src = result, 
                        img.setAttribute('width', '330px'),
                        img.id = "imgclick",
                        snapshots.insertBefore(img, buttonscreeshot),
                        document.getElementById('screenshot').textContent = ""
                    ).then(
                        result2 =>  writeToClipboard2(new Blob([snapshots.innerHTML], {type: 'text/html'}))
                    ).then(
                        result3 => document.getElementById('screenshot').textContent = "Prendre un screenshot"
                    )
                    /* const toastLiveExample = document.getElementById('copyToast')
                    const toast = new bootstrap.Toast(toastLiveExample)
                    toast.show() */
                    Toast.fire({
                        icon: 'success',
                        title: 'La sélection a bien été copiée dans le presse papier'
                    })
          
                })

            }

            $("#myModal").hide();
            $("#inputs")[0].reset();
            viewer.scene.input.setEnabled(true);
        })

        i++;

        $("#closebutton").click(function() {
            viewer.scene.input.setEnabled(true);
        })

        
    }

    


});

window.viewer = viewer;

window.onoffline = (event) => {
    alert("La connexion au réseau a été perdue.");
};

window.ononline = (event) => {
    alert("La connexion au réseau réussi.");
};


//------------------------------------------------------------------------------------------------------------------
//Créer une notification
const Toast = Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

//Popup lors de la suppression d'une image puis copie dans le presse papier
$(document).on("click", "img#imgclick", function(e) { 
    Swal.fire({
        title: 'Voulez-vous vraiment supprimer la photo ?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Oui',
        denyButtonText: 'Non',
        confirmButtonColor: "#3085d6",
        customClass: {
          actions: 'my-actions',
          confirmButton: 'order-1',
          denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(this).remove()
            //Swal.fire('Saved!', '', 'success')
            document.getElementById('screenshot').textContent = ""
            let blob = new Blob([snapshots.innerHTML], {type: 'text/html'});
            writeToClipboard2(blob)
            document.getElementById('screenshot').textContent = "Prendre un screenshot"
            Toast.fire({
                icon: 'success',
                title: 'La sélection a bien été copiée dans le presse papier'
            })
        } else if (result.isDenied) {
            //Swal.fire('Changes are not saved', '', 'info')
        }
    })
      
});


//------------------------------------------------------------------------------------------------------------------
//Récupère le divelementcopier et le transforme en HTML
function createElement(str) {
    var frag = document.createDocumentFragment();

    var elem = document.createElement('div');
    elem.innerHTML = str;

    while (elem.childNodes[0]) {
        frag.appendChild(elem.childNodes[0]);
    }
    return frag;
}

//------------------------------------------------------------------------------------------------------------------
//Fonction permettant de copier l'élément dans le clipboard
async function writeToClipboard2(imageBlob) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': imageBlob,
        }),
      ]);
    } catch (error) {
      console.error(error);
    }
}

//------------------------------------------------------------------------------------------------------------------
//Récupère les données du treeView et en fait un JSON avec les fils et les parents de chaque noeuds
function FetchChild(){
    var data =[];
    $('#treeViewContainer2 li').each(function(){
        //console.log($(this).find("span").text())
        data.push(buildJSON($(this)));
    });

    return data;
}
function buildJSON($li) {
    var subObj = { "name" : $li.find("input").attr('id').substr(1) };
    $li.children('ul').children().each(function() {
        if (!subObj.children) { 
        subObj.children = [];
        }
        subObj.children.push(buildJSON($(this)));
    });
    return subObj;
}


//------------------------------------------------------------------------------------------------------------------
//Recherche les fils du noeuds sélectionné dans la zone de recherche
function mergeChildren(sources) {
    var children = [];
    for (var index in sources) {
        var source = sources[index];
        children.push(source.name)
        if (source.children) {
            children = children.concat(mergeChildren(source.children))
        }
    }
    return children;
}
  
function findChildrenForK(sources, k) {
    for (var index in sources) {
        var source = sources[index];
        if (source.name === k) {
            if (source.children) {
                return mergeChildren(source.children);
            }
        }
    }
}


//------------------------------------------------------------------------------------------------------------------
function loadStuff() {
    var apiPath = "/model/test/ifc"
    $.get(apiPath, function(data){
        console.log("apiPath : ", data)
    })
}


loadStuff()

