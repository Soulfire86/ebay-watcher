//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EbayWatcher.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class User
    {
        public User()
        {
            this.WishlistItems = new HashSet<WishlistItem>();
        }
    
        public int Id { get; set; }
        public string EbaySessionId { get; set; }
        public string EbayToken { get; set; }
        public string EbayUsername { get; set; }
    
        public virtual ICollection<WishlistItem> WishlistItems { get; set; }
    }
}