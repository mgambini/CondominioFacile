function registra() {
	var idCondominio=$('#invito').val();
	var myDataRef = new Firebase('https://blinding-heat-1032.firebaseio.com/condominio/');

	myDataRef.authAnonymously(function(error, authData) {
      if (error) {
        //console.log("Login Failed!", error);
        alert("Login Failed!")
      } else {
        //console.log("Authenticated successfully with payload:", authData);
        alert("Authenticated successfully with payload:"+ authData);
      }
    }, {
       remember: "sessionOnly"
     });

	myDataRef.orderByChild("idcondominio").equalTo(idCondominio).once('value', function(snapshot) {
	var exists = (snapshot.val() !== null);
    var snapKey=Object.keys(snapshot.val())[0];
    if(exists){
    	var condominioRef = new Firebase('https://blinding-heat-1032.firebaseio.com/condominio/'+snapKey+'/elencoCondomini');
		var codiceFiscale=$('#frmRegister [name="codiceFiscale"]').val();
		condominioRef.orderByChild("codiceFiscale").equalTo(codiceFiscale).once('value', function(condomino) {
    		var condominoExists = (condomino.val() !== null);
    		if(condominoExists)alert('l\'utente '+codiceFiscale+' è già registrato');
    		else{
    			var refCondomini=myDataRef.child('elencoCondomini');
    			var utente=refCondomini.push({
    				'nome':$('#frmRegister [name="nome"]').val(),
    				'cognome':$('#frmRegister [name="cognome"]').val(),
    				'email':$('#frmRegister [name="email"]').val(),
    				'codiceFiscale':$('#frmRegister [name="codiceFiscale"]').val(),
    				'username':$('#frmRegister [name="username"]').val(),
    				'password':$('#frmRegister [name="password"]').val(),
    				});
    			var idUtente=utente.name();
    			refCondomini.child(idUtente+'/condomini').push({'idCondominio':snapKey});
    			condominioRef.push({'codiceFiscale':$('#frmRegister [name="codiceFiscale"]').val()});
    			localStorage.setItem('idCondominio', snapKey);
    			localStorage.setItem('idUtente', idUtente);
    			localStorage.setItem('nome', $('#frmRegister [name="nome"]').val());
    			localStorage.setItem('cognome', $('#frmRegister [name="cognome"]').val());
    			document.location.href='index.html';
    		}
    	});
    }
    else{
    	alert('Attenzione: il codice del condominio è sbagliato o il condominio è inesistente');
    }
  });
}