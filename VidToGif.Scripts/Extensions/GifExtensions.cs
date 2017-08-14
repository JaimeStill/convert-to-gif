using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Text;
using System.Threading.Tasks;

namespace VidToGif.Scripts.Extensions
{
    public static class GifExtensions
    {
        public static List<string> GetFlagOptions()
        {
            return new List<string>()
            {
                "fast_bilinear",
                "bilinear",
                "bicubic",
                "experimental",
                "neighbor",
                "area",
                "bicublin",
                "gauss",
                "sinc",
                "lanczos",
                "spline",
                "print_info",
                "accurate_rnd",
                "full_chroma_int",
                "full_chroma_inp",
                "bitexact"
            };
        }

        public static List<string> GetLogOptions()
        {
            return new List<string>()
            {
                "quiet",
                "panic",
                "fatal"
            };
        }

        public static async Task<ConsoleOutput> ConvertToGif(this GifOptions model)
        {
            try
            {
                InitialSessionState iss = InitialSessionState.CreateDefault();
                // iss.ExecutionPolicy = Microsoft.PowerShell.ExecutionPolicy.Unrestricted;

                using (Runspace rs = RunspaceFactory.CreateRunspace(iss))
                {
                    rs.Open();

                    var script = await (".Scripts.Create-Gif.ps1").GetTextFromEmbeddedResource();
                    Command createGif = new Command(script, true);
                    createGif.Parameters.Add("exec", model.exec);
                    createGif.Parameters.Add("origin", model.origin);
                    createGif.Parameters.Add("destination", model.destination);
                    createGif.Parameters.Add("fps", model.fps);
                    createGif.Parameters.Add("scale", model.scale);
                    createGif.Parameters.Add("flags", model.flags);
                    createGif.Parameters.Add("log", model.log);

                    using (PowerShell ps = PowerShell.Create())
                    {
                        ps.Runspace = rs;
                        ps.Commands.AddCommand(createGif);
                        ps.Invoke();
                        var output = await ps.GetPowershellOutput();

                        if (!output.hasError)
                        {
                            output.result = $"{model.destination} successfully created";
                        }

                        return output;
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.GetExceptionMessageChain());
            }
        }
    }
}
