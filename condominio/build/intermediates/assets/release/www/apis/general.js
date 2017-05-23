/* Copyright (c) 2015 Mobile Developer Solutions. All rights reserved.
 * This software is available under the MIT License:
 * The MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var nome;
var cognome;
var idUtente;
var idCondominio;
var codiceFiscale;
var myDataRef = new Firebase('https://blinding-heat-1032.firebaseio.com/condominio');

$().ready(function(){
	nome=localStorage.getItem('nome');
	if(typeof nome==undefined || nome==null){document.location.href='logon.html';}
	cognome=localStorage.getItem('cognome');
	idUtente=localStorage.getItem('idUtente');
	idCondominio=localStorage.getItem('idCondominio');
	codiceFiscale=localStorage.getItem('codiceFiscale');
	$('#li-header strong').html(nome+' '+cognome);
	selectListaUtentiPopulate();
	checkOutbox();
	checkInbox();
	$('#confirm').popup();
});

function confirmAndDelete( listitem, element ) {
	var casella=element.substring(5);
	// Evidenziamo l'elemento da rimuovere
    listitem.addClass( "ui-btn-down-d" );
    // Iniettiamo il topic nel popup di conferma eliminando al contempo qualsiasi altro topic iniettato in precedenza
    $( "#confirm .topic" ).remove();
    listitem.find( ".topic" ).clone().insertAfter( "#question" );
    // Visualizzaiamo il popup di conferma
    $( "#confirm" ).popup( "open" );
    // Cancelliamo l'elemento
    $( "#confirm #yes" ).on( "click", function() {
        messageRef=myDataRef.child('/elencoCondomini/'+idUtente+'/'+casella);
        messageRef.orderByChild('idMessaggio').equalTo(listitem.attr('id')).once('value',function(snapshot){
        	snapshot.forEach(function (message){
        		var idMessaggio=message.val();
                messageRef.child(message.key()).remove(function(){
        	    	listitem.remove();
        	        $( element ).listview( "refresh" );
        		});
        	});
        });
    });
    // Se l'utente clicca su 'cancella', rimuoviamo lo stato attivo e cancelliamo il bind con il click sul pulsante di conferma
    $( "#confirm #cancel" ).on( "click", function() {
        listitem.removeClass( "ui-btn-down-d" );
        $( "#confirm #yes" ).off();
    });
}