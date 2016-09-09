//
// Released under the  GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007.
// Sebastian Zimmeck, sebastian@sebastianzimmeck.de
//

// IObjectWithSite.cs

using System;
using System.Collections.Generic;
using System.Text;

using System.Runtime.InteropServices;

namespace IE_Browser_History
{
    [
    ComVisible(true),
    InterfaceType(ComInterfaceType.InterfaceIsIUnknown),
    Guid("FC4801A3-2BA9-11CF-A229-00AA003D7352")
    ]

    public interface IObjectWithSite
    {
        [PreserveSig]
        int SetSite([MarshalAs(UnmanagedType.IUnknown)]object site);
        [PreserveSig]
        int GetSite(ref Guid guid, out IntPtr ppvSite);
    }
}