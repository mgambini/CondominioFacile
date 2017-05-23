$("#logon").click(
		function(){
			var userId=$('#username').val();
			var password=$('#password').val();
			var myDataRef = new Firebase('https://blinding-heat-1032.firebaseio.com/condominio/elencoCondomini');
			myDataRef.orderByChild("username").equalTo($('#username').val()).limitToFirst(1).once('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
				    var key = childSnapshot.key();
				    var childData = childSnapshot.val();
					if(childData.password!=$('#password').val())alert('password errata');
					else{
						var chiave=Object.keys(childData.condomini)[0];
						var arrayCondomini=new Array();
						var i=0;
						var idCond;
						for(var prop in childData.condomini) {
						    if(childData.condomini.hasOwnProperty(prop)){
						    	idCond=childData.condomini[prop].idCondominio;
						    	localStorage.setItem('idCondominio', idCond);
						    	arrayCondomini[i]=idCond;
						    	i++;
						    }
						}
						localStorage.setItem('listaCondomini',JSON.stringify(arrayCondomini));
						localStorage.setItem('idUtente', Object.keys(snapshot.val())[0]);
						localStorage.setItem('nome', childData.nome);
						localStorage.setItem('cognome', childData.cognome);
						localStorage.setItem('codiceFiscale', childData.codiceFiscale);
						document.location.href='index.html';
					}
				});
		});
});


$().ready(function(){
	var nome=localStorage.getItem('nome');
	if(typeof nome!=undefined && nome!=null){document.location.href='index.html';}
});

