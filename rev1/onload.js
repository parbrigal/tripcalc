window.onload = function() 
{
    var n=new gmap.GMap(this.getElement());
    this.onStateChange=function()
        {
            console.log("state change ->",this.getState().value)
        };
        var t=this;
        n.click=function()
        {
            t.onClick(n.getValue())
        }
}