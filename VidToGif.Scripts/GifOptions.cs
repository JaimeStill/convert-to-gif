using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VidToGif.Scripts
{
    public class GifOptions
    {
        public string exec { get; set; }
        public string origin { get; set; }
        public string destination { get; set; }
        public int fps { get; set; }
        public int scale { get; set; }
        public string flags { get; set; }
        public string log { get; set; }
    }
}
